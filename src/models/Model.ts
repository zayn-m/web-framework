import { AxiosResponse, AxiosPromise } from 'axios';

interface ModelAttributes<T> {
	set(value: T): void;
	get<K extends keyof T>(key: K): T[K];
}

interface Sync<T> {
	fetch(id: number): AxiosPromise;
	save(data: T): AxiosPromise;
}

interface Events {
	on(eventName: string, callback: () => void): void;
	trigger(eventName: string): void;
}

interface HasId {
	id?: number;
}

export class Model<T extends HasId> {
	constructor(private attributes: ModelAttributes<T>, private events: Events, private sync: Sync<T>) {}

	on = this.events.on;
	trigger = this.events.trigger;
	get = this.attributes.get;

	set(update: T): void {
		this.attributes.set(update);
		this.events.trigger('change');
	}

	fetch(): void {
		const id = this.get('id');
		if (typeof id !== 'number') {
			throw new Error('Cannot fetch without id');
		}

		this.sync.fetch(id).then((res: AxiosResponse): void => {
			this.set(res.data);
		});
	}
}
