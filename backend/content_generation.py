from agno.agent import Agent
from agno.models.anthropic import Claude
from agno.models.openai import OpenAIChat
from agno.team.team import Team
from agno.tools.googlesearch import GoogleSearchTools
from agno.utils.pprint import pprint_run_response

from data.utils import (
    get_knowledge_graph,
    get_lesson_plan,
    parse_json,
    write_knowledge_graph,
    write_lesson_plan,
    fetch_user_id,
)
from data.model import KnowledgeGraph, LessonPlan

from dotenv import load_dotenv

load_dotenv("./.env")

content_generator_agent = Agent(
    name="Content Generator",
    role="Creates and refines learning materials and answers user questions",
    instructions=[
        "Parse the instruction for the user_id, source_prompt, and refined_instruction",
        "Begin by generating a comprehensive learning plan based on the users knowledge history and learning pace",
        "Ask the researcher to provide additional external resources",
        "Utilize the provided resources to be included in the following output",
        """Your output must adhere to the following JSON Structure:\n
        {'user_id': 'str',\n
        'plan_id': 'str', \n 
        plan_title': 'title of new plan', \n
        'description': 'description of plan', \n
        'created_at': 'datetime', \n 
        'last_accessed': 'datetime', \n 
        'status': 'active or archived: default to active', \n 
        'source_prompt': 'prompt from the initial query', \n
        'lessons': [{'lesson_id':str, 'title':'str', 'objectives':['str'], 'content': 'str', 'external_resources':['str'], 'order': 'int'}]""",
        "Ensure that the JSON output contains a list of lessons with objectives in mind. This is the main priority."
        "Hand off the information to Data Inputter to write to the database",
    ],
    description="You generate comprehensive syllabi (lesson plans) from vague prompts",
    # response_model=LessonPlan,
    # use_json_mode=True,
    structured_outputs=True,
    add_datetime_to_instructions=True,
)

research_agent = Agent(
    name="Researcher",
    role="Find relevant content and information for a given topic",
    instructions=[
        "search the web for relevant content for a given topic",
        "Only include the most relevant results, between 2-3 links per lesson",
    ],
    tools=[GoogleSearchTools()],
)

content_writer_agent = Agent(
    name="Data Writer",
    role="Input data into the database",
    instructions=[
        """ Ensure that the provided message follows this structure:\n
        {'user_id': 'str',\n
        'plan_id': 'str', \n 
        plan_title': 'title of new plan', \n
        'description': 'description of plan', \n
        'created_at': 'datetime', \n 
        'last_accessed': 'datetime', \n 
        'status': 'active or archived: default to active', \n 
        'source_prompt': 'prompt from the initial query', \n
        'lessons': [{'lesson_id':str, 'title':'str', 'objectives':['str'], 'content': 'str', 'external_resources':['str'], 'order': 'int'}]""",
        "Use the write_lesson_plan tool to add this information to the database",
        "if the user does not have an ID, use fetch_user_id",
    ],
    tools=[write_lesson_plan, fetch_user_id],
)

content_generation_agent = Team(
    name="Content Generator Leader",
    mode="coordinate",
    members=[content_generator_agent, research_agent, content_writer_agent],
    model=OpenAIChat(),
    instructions=[
        """Ensure that the following information is included in the task description: \n
        source_prompt: 'original user prompt'\n
        user_id: 'user_id'\n
        refined instruction: 'your instruction'"""
        "Begin by generating a comprehensive learning plan based on the users knowledge history and learning pace",
        "Delegate tasks to the content generator and data writer to format and append the data to memory",
        "insure that the data is formatted to JSON when provided to the data writer",
        "Ensure the data is inputted to the database using get_lesson_plan with user_id and plan_id",
        "If the data is not returned, then ask the inputter to try again",
        "return the plan_id alongside the generated plan message",
    ],
    tools=[get_lesson_plan],
    description="You generate comprehensive syllabi (lesson plans) from vague prompts",
    add_datetime_to_instructions=True,
    add_member_tools_to_system_message=True,  # This can be tried to make the agent more consistently get the transfer tool call correct
    enable_agentic_context=True,  # Allow the agent to maintain a shared context and send that to members.
    share_member_interactions=True,  # Share all member responses with subsequent member requests.
    show_members_responses=True,
)


graph_generator_agent = Agent(
    name="Graph Generator",
    model=OpenAIChat(),
    instructions=[
        "Gather the lesson plan information using get_lesson_plan from the user_id and plan_id",
        "Parse the information and understand each lessons content and how they relate to each other",
        """Generate node information in the following JSON Format:\n
        {'concept_id': 'str', \n
        'name': 'concept name', \n
        'description': 'str', \n
        'mastery_level': 'int between 0-100', \n
        'last_reviewed': 'datetime', \n
        'next_review': 'datetime', \n
        'source_lesson_id': 'str'
        }
        """,
        """Generate edge information in the following JSON format:\n 
    {'edge_id': 'str',
    'source_concept_id': 'str',
    'target_concept_id': 'str'
    'relationship_type': 'related_to, prerequisite_for, or part_of'}
    """,
    ],
    tools=[get_lesson_plan],
    structured_outputs=True,
    use_json_mode=True,
    add_datetime_to_instructions=True,
)

graph_writer_agent = Agent(
    name="Graph Writer",
    model=OpenAIChat(),
    instructions=[
        "Parse the message for user_id, list of edges, and list of nodes from the graph generator",
        "Using write_knowledge_graph, write the generated user knowledge graph to the database",
    ],
    tools=[write_knowledge_graph],
    add_datetime_to_instructions=True,
)

knowledge_graph_agent = Team(
    name="Knowledge Graph Leader",
    model=OpenAIChat(),
    members=[graph_generator_agent, graph_writer_agent],
    instructions=[
        "Determine if the knowledge graph should be updated or generated from scratch by using get_knowledge_graph with the user_id",
        "Delegate tasks to the graph generator to format the data for the graph writer",
        "then hand the graph writer the content alongside the user_id for appending to memory"
        "Ensure the data is inputted to the database using get_knowledge_graph with user_id",
        "If the data is not returned, then ask the inputter to try again",
        "return the plan_id alongside the generated plan message",
    ],
    tools=[get_knowledge_graph],
    add_datetime_to_instructions=True,
    add_member_tools_to_system_message=True,  # This can be tried to make the agent more consistently get the transfer tool call correct
    enable_agentic_context=True,  # Allow the agent to maintain a shared context and send that to members.
    share_member_interactions=True,  # Share all member responses with subsequent member requests.
    show_members_responses=True,
)
leader = Team(
    name="Learning Orchestrator",
    mode="coordinate",
    members=[content_generation_agent, knowledge_graph_agent],
    model=Claude(id="claude-3-7-sonnet-latest"),
    description="You are the central coordinator in charge of determining user intent from input and delegating tasks to other agents",
    instructions=[
        "Given a prompt, determine what the user wants",
        "if the user wants to learn about a new topic, ask the content generator to curate a learning plan",
        """Whenever delegating a task to a member,
        always include the original prompt and the user_id in this format:\n
        source_prompt: 'original user prompt'\n
        user_id: 'user_id'\n
        refined instruction: 'your instruction'""",
        "then ask the graph agent to generate a knowledge graph of the lesson plan",
    ],
    add_datetime_to_instructions=True,
    add_member_tools_to_system_message=True,  # This can be tried to make the agent more consistently get the transfer tool call correct
    enable_agentic_context=True,  # Allow the agent to maintain a shared context and send that to members.
    share_member_interactions=True,  # Share all member responses with subsequent member requests.
    show_members_responses=True,
    # response_model=LessonPlan,
    # use_json_mode=True,
)

# pprint_run_response(
#     leader.run(
#         "user_id: carl, prompt: 'I want to learn about linear algebra'", stream=True
#     )
# )
leader.print_response(
    "user_id=jack, prompt=I want to learn about linear algebra", stream=True
)
