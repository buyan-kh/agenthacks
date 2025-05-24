import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from pydantic_core import from_json

from data.model import (
    KnowledgeGraph,
    LessonPlan,
    UserArtifact,
    UserProfile,
    Lesson,
)

from dotenv import load_dotenv

load_dotenv("./backend/.env")

fbpath = os.environ["FIRESTORE_PATH"]
cred = credentials.Certificate(fbpath)

app = firebase_admin.initialize_app(cred)

db = firestore.client()

users_ref = db.collection("users")


def write_user(UserProfile: UserProfile):
    users_ref.document(UserProfile.uid).set(UserProfile.to_firestore_dict())


def read_user_profile(userId):
    user = users_ref.document(userId).get()
    if user.exists:
        return user


def write_lessons_from_artifact(user_artifact: UserArtifact):
    for lesson_plan in user_artifact.lesson_plans:
        write_lesson_plan(user_artifact.user_id, lesson_plan)


def parse_json(model_output):
    lesson_plan = LessonPlan.model_validate(from_json(model_output, allow_partial=True))
    return lesson_plan


def fetch_user_id():
    return "aturing"


def get_lesson_plan(userId, planId):
    userdb = db.collection("users").document(userId)
    lessons_ref = userdb.collection("lessonPlans")
    lesson = lessons_ref.document(planId)
    if lesson.get().exists:
        return lesson
    else:
        return None


def write_lesson_plan(userId, lesson_plan):
    userdb = db.collection("users").document(lesson_plan["user_id"])
    lessonplan_ref = userdb.collection("lessonPlans").document(lesson_plan["plan_id"])
    lessonplan_ref.set(
        {
            "description": lesson_plan["description"],
            "created_at": lesson_plan["created_at"],
            "last_accessed": lesson_plan["last_accessed"],
            "status": lesson_plan["status"],
            "source_prompt": lesson_plan["source_prompt"],
        }
    )
    lessons_ref = lessonplan_ref.collection("lessons")
    for lesson in lesson_plan["lessons"]:
        lessons_ref.document(lesson["lesson_id"]).set(
            {
                "title": lesson["title"],
                "objectives": lesson["title"],
                "content": lesson["content"],
                "external_resources": lesson["external_resources"],
                "order": lesson["order"],
            }
        )


# def write_lesson_plan(userId, lesson_plan: LessonPlan):
#     userdb = db.collection("users").document(userId)
#     lessonplan_ref = userdb.collection("lessonPlans").document(lesson_plan.plan_id)
#     lessonplan_ref.set(lesson_plan.to_firestore_dict())
#     lessons_ref = lessonplan_ref.collection("lessons")
#     for lesson in lesson_plan.lessons:
#         lessons_ref.document(lesson.lesson_id).set(lesson.to_firestore_dict())
#     progress_ref = lessonplan_ref.collection("progress")
# for progress in lesson_plan.progress:
#     progress_ref.document(progress.lesson_id).set(progress.to_firestore_dict())


def write_knowledge_graph(userId, nodes, edges):
    userdb = db.collection("users").document(userId)
    graph_ref = userdb.collection("knowledgeGraph")
    node_holder = graph_ref.document("nodeHolder").collection("nodes")
    edge_holder = graph_ref.document("edgeHolder").collection("edges")
    for node in nodes:
        node_holder.document(str(node["concept_id"])).set(
            {
                "name": node["name"],
                "description": node["description"],
                "mastery_level": node["mastery_level"],
                "last_reviewed": node["last_reviewed"],
                "next_review": node["next_review"],
                "source_lesson_id": node["source_lesson_id"],
            }
        )
    for edge in edges:
        edge_holder.document(str(edge["edge_id"])).set(
            {
                "source_concept_id": edge["source_concept_id"],
                "target_concept_id": edge["target_concept_id"],
                "relationship_type": edge["relationship_type"],
            }
        )


def get_knowledge_graph(userId):
    userdb = db.collection("users").document(userId)
    graphref = userdb.collection("knowledgeGraph")
    node_holder = graphref.document("nodeHolder").collection("nodes")
    edge_holder = graphref.document("edgeHolder").collection("edges")
    checkNode = node_holder.limit(1).get()
    if not checkNode:
        return None
    nodes = node_holder.stream()
    edges = edge_holder.stream()
    graph = {
        nodes: [{node.id: node.to_dict()} for node in nodes],
        edges: [{edge.id: edge.to_dict()} for edge in edges],
    }
    return graph


# def write_knowledge_graph(userId, knowledge_graph: KnowledgeGraph):
#     userdb = db.collection("users").document(userId)
#     graph_ref = userdb.collection("knowledgeGraph")
#     node_holder = graph_ref.document("nodeHolder").collection("nodes")
#     edge_holder = graph_ref.document("edgeHolder").collection("edges")
#     for node in knowledge_graph.nodes:
#         node_holder.document(node.concept_id).set(node.to_firestore_dict())
#     for edge in knowledge_graph.edges:
#         edge_holder.document(edge.edge_id).set(edge.to_firestore_dict())
