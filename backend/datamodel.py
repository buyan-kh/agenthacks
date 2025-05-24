from datetime import datetime
from typing import List, Dict, Any, Optional
from enum import Enum
import json
from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator
from pydantic.alias_generators import to_camel


class LessonPlanStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class ProgressStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class RelationshipType(str, Enum):
    PREREQUISITE_FOR = "prerequisite_for"
    RELATED_TO = "related_to"
    PART_OF = "part_of"


class ReminderType(str, Enum):
    REVIEW = "review"
    GOAL_MILESTONE = "goal_milestone"


class ContentType(str, Enum):
    TEXT = "text"
    QUIZ = "quiz"


class FirestoreModel(BaseModel):
    """Base model for all Firestore documents with common configuration."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        str_strip_whitespace=True,
        validate_assignment=True,
        arbitrary_types_allowed=True,
    )

    def to_firestore_dict(self) -> Dict[str, Any]:
        """Convert to Firestore-compatible dictionary with camelCase keys."""
        return self.model_dump(by_alias=True, exclude_none=True)

    def to_json(self) -> str:
        """Convert to JSON string with datetime serialization."""
        return self.model_dump_json(by_alias=True, exclude_none=True)


class Goal(FirestoreModel):
    text: str
    target_date: datetime
    completed: bool = False


class UserProfile(FirestoreModel):
    uid: str
    email: str
    display_name: str
    created_at: datetime = Field(default_factory=datetime.now)
    last_login: datetime = Field(default_factory=datetime.now)
    learning_preferences: Dict[str, str] = Field(
        default_factory=lambda: {"content_format": "text", "pace": "moderate"}
    )

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if "@" not in v:
            raise ValueError("Invalid email format")
        return v.lower()

    @field_validator("learning_preferences")
    @classmethod
    def validate_preferences(cls, v: Dict[str, str]) -> Dict[str, str]:
        valid_formats = {"text", "video", "interactive"}
        valid_paces = {"slow", "moderate", "fast"}

        if "content_format" in v and v["content_format"] not in valid_formats:
            raise ValueError(f"Invalid content_format. Must be one of: {valid_formats}")
        if "pace" in v and v["pace"] not in valid_paces:
            raise ValueError(f"Invalid pace. Must be one of: {valid_paces}")

        return v


class QuizAttempt(FirestoreModel):
    question_id: str
    user_answer: str
    is_correct: bool
    timestamp: datetime = Field(default_factory=datetime.now)


class Progress(FirestoreModel):
    lesson_id: str = Field(..., description="Document ID")
    status: ProgressStatus = ProgressStatus.NOT_STARTED
    last_accessed: datetime = Field(default_factory=datetime.now)
    quiz_attempts: List[QuizAttempt] = Field(default_factory=list)
    mastery_score: int = Field(default=0, ge=0, le=100, description="Score from 0-100")
    accessed_resources: List[str] = Field(
        default_factory=list, description="URLs from external resources"
    )


class ExternalResource(FirestoreModel):
    title: str
    url: str
    accessed: bool = False

    @field_validator("url")
    @classmethod
    def validate_url(cls, v: str) -> str:
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("URL must start with http:// or https://")
        return v


class ContentBlock(FirestoreModel):
    type: ContentType
    value: Optional[str] = Field(None, description="Text content")
    questions: Optional[List[Dict[str, Any]]] = Field(
        None, description="Quiz questions"
    )

    @model_validator(mode="after")
    def validate_content(self):
        if self.type == ContentType.TEXT and not self.value:
            raise ValueError("Text content blocks must have a value")
        if self.type == ContentType.QUIZ and not self.questions:
            raise ValueError("Quiz content blocks must have questions")
        return self


class Lesson(FirestoreModel):
    lesson_id: str = Field(..., description="Document ID")
    title: str
    objectives: List[str] = Field(min_length=1)
    content: List[ContentBlock] = Field(min_length=1)
    external_resources: List[ExternalResource] = Field(default_factory=list)
    order: int = Field(ge=0)


class LessonPlan(FirestoreModel):
    plan_id: str = Field(..., description="Document ID")
    title: str
    description: str
    created_at: datetime = Field(default_factory=datetime.now)
    last_accessed: datetime = Field(default_factory=datetime.now)
    status: LessonPlanStatus = LessonPlanStatus.ACTIVE
    goals: List[Goal] = Field(default_factory=list)
    source_prompt: str

    # Sub-collections (not included in Firestore document)
    lessons: List[Lesson] = Field(default_factory=list, exclude=True)
    progress: List[Progress] = Field(default_factory=list, exclude=True)

    def get_lessons_dict(self) -> Dict[str, Dict[str, Any]]:
        """Get lessons as dictionary for Firestore subcollection."""
        return {lesson.lesson_id: lesson.to_firestore_dict() for lesson in self.lessons}

    def get_progress_dict(self) -> Dict[str, Dict[str, Any]]:
        """Get progress as dictionary for Firestore subcollection."""
        return {
            progress.lesson_id: progress.to_firestore_dict()
            for progress in self.progress
        }


class UserFeedback(FirestoreModel):
    accuracy_rating: Optional[int] = Field(
        None, ge=1, le=5, description="Rating from 1-5"
    )
    relevance_rating: Optional[int] = Field(
        None, ge=1, le=5, description="Rating from 1-5"
    )


class KnowledgeNode(FirestoreModel):
    concept_id: str = Field(..., description="Document ID")
    name: str
    description: str
    mastery_level: int = Field(
        default=0, ge=0, le=100, description="Mastery level 0-100"
    )
    last_reviewed: datetime = Field(default_factory=datetime.now)
    next_review: datetime = Field(default_factory=datetime.now)
    repetition_interval: int = Field(
        default=1, ge=1, description="Days until next review"
    )
    source_lesson_id: Optional[str] = None
    user_feedback: UserFeedback = Field(default_factory=UserFeedback)


class KnowledgeEdge(FirestoreModel):
    edge_id: str = Field(..., description="Document ID")
    source_concept_id: str
    target_concept_id: str
    relationship_type: RelationshipType
    user_feedback: UserFeedback = Field(default_factory=UserFeedback)

    @field_validator("target_concept_id")
    @classmethod
    def validate_different_concepts(cls, v: str, info) -> str:
        if (
            hasattr(info.data, "source_concept_id")
            and v == info.data["source_concept_id"]
        ):
            raise ValueError("Source and target concept IDs must be different")
        return v


class KnowledgeGraph(FirestoreModel):
    nodes: List[KnowledgeNode] = Field(default_factory=list)
    edges: List[KnowledgeEdge] = Field(default_factory=list)

    def get_nodes_dict(self) -> Dict[str, Dict[str, Any]]:
        """Get all nodes as dictionary for Firestore subcollection."""
        return {node.concept_id: node.to_firestore_dict() for node in self.nodes}

    def get_edges_dict(self) -> Dict[str, Dict[str, Any]]:
        """Get all edges as dictionary for Firestore subcollection."""
        return {edge.edge_id: edge.to_firestore_dict() for edge in self.edges}

    def add_node(self, node: KnowledgeNode) -> None:
        """Add a node to the knowledge graph."""
        if any(n.concept_id == node.concept_id for n in self.nodes):
            raise ValueError(f"Node with concept_id '{node.concept_id}' already exists")
        self.nodes.append(node)

    def add_edge(self, edge: KnowledgeEdge) -> None:
        """Add an edge to the knowledge graph."""
        # Validate that both concepts exist
        source_exists = any(n.concept_id == edge.source_concept_id for n in self.nodes)
        target_exists = any(n.concept_id == edge.target_concept_id for n in self.nodes)

        if not source_exists:
            raise ValueError(
                f"Source concept '{edge.source_concept_id}' does not exist"
            )
        if not target_exists:
            raise ValueError(
                f"Target concept '{edge.target_concept_id}' does not exist"
            )

        self.edges.append(edge)


class Reminder(FirestoreModel):
    reminder_id: str = Field(..., description="Document ID")
    type: ReminderType
    scheduled_time: datetime
    dismissed: bool = False
    concept_id: Optional[str] = None
    lesson_plan_id: Optional[str] = None

    @model_validator(mode="after")
    def validate_reminder_reference(self):
        if self.type == ReminderType.REVIEW and not self.concept_id:
            raise ValueError("Review reminders must have a concept_id")
        if self.type == ReminderType.GOAL_MILESTONE and not self.lesson_plan_id:
            raise ValueError("Goal milestone reminders must have a lesson_plan_id")
        return self


class UserArtifact(FirestoreModel):
    """
    Root document representing a user's artifact in Firestore.
    Path: /artifacts/{appId}/users/{userId}/
    """

    app_id: str
    user_id: str
    user_profile: UserProfile
    lesson_plans: List[LessonPlan] = Field(default_factory=list, exclude=True)
    knowledge_graph: Optional[KnowledgeGraph] = Field(None, exclude=True)
    reminders: List[Reminder] = Field(default_factory=list, exclude=True)

    def get_user_profile_dict(self) -> Dict[str, Any]:
        """Get user profile as Firestore document."""
        return self.user_profile.to_firestore_dict()

    def get_lesson_plans_dict(self) -> Dict[str, Dict[str, Any]]:
        """Get all lesson plans as dictionary for Firestore collection."""
        return {plan.plan_id: plan.to_firestore_dict() for plan in self.lesson_plans}

    def get_reminders_dict(self) -> Dict[str, Dict[str, Any]]:
        """Get all reminders as dictionary for Firestore collection."""
        return {
            reminder.reminder_id: reminder.to_firestore_dict()
            for reminder in self.reminders
        }

    def get_knowledge_graph_dict(
        self,
    ) -> Optional[Dict[str, Dict[str, Dict[str, Any]]]]:
        """Get knowledge graph structure for Firestore."""
        if not self.knowledge_graph:
            return None
        return {
            "nodes": self.knowledge_graph.get_nodes_dict(),
            "edges": self.knowledge_graph.get_edges_dict(),
        }

    def export_to_json(self) -> str:
        """Export entire structure to JSON for backup/debugging."""
        data = {
            "appId": self.app_id,
            "userId": self.user_id,
            "userProfile": self.get_user_profile_dict(),
            "lessonPlans": self.get_lesson_plans_dict(),
            "reminders": self.get_reminders_dict(),
        }

        kg_data = self.get_knowledge_graph_dict()
        if kg_data:
            data["knowledgeGraph"] = kg_data

        return json.dumps(data, default=str, indent=2)

    def add_lesson_plan(self, lesson_plan: LessonPlan) -> None:
        """Add a lesson plan with validation."""
        if any(lp.plan_id == lesson_plan.plan_id for lp in self.lesson_plans):
            raise ValueError(
                f"Lesson plan with ID '{lesson_plan.plan_id}' already exists"
            )
        self.lesson_plans.append(lesson_plan)

    def get_lesson_plan(self, plan_id: str) -> Optional[LessonPlan]:
        """Get a lesson plan by ID."""
        return next((lp for lp in self.lesson_plans if lp.plan_id == plan_id), None)
