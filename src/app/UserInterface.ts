import type { Card } from "../core/cataloging/Card.js";
import type { Topic } from "../core/cataloging/Topic.js";
import type { Grade } from "../core/scheduling/Grade.js";

export interface UserInterface {
	requestTopicForReview(catalog: Topic): Promise<Topic>;
	letStudentSelfEvaluate(card: Card): Promise<Grade>;
}
