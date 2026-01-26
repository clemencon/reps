import type { Card } from "../../../src/core/cataloging/Card.js";
import { Deck } from "../../../src/core/cataloging/Deck.js";
import { CardBuilder } from "./CardBuilder.js";

export class DeckBuilder {
	private cards: Card[] = [];

	public withCards(amount: number): DeckBuilder {
		this.cards = Array.from({ length: amount }, () => new CardBuilder().build());
		return this;
	}

	public empty(): DeckBuilder {
		this.cards = [];
		return this;
	}

	public build(): Deck {
		return new Deck(...this.cards);
	}
}
