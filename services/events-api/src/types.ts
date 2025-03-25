export interface Event {
	id: string;
	type: "CONCERT" | "SPECTACLE" | "FESTIVAL";
	date: Date;
	price: number;
	location: string;
	name: string;
}

export interface EventUpdate {
	type?: "CONCERT" | "SPECTACLE" | "FESTIVAL";
	date?: Date;
	price?: number;
	location?: string;
	name?: string;
}
