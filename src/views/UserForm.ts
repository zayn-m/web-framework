import { User } from '../models/User';

export class UserForm {
	constructor(public parent: Element, public model: User) {}

	eventsMap(): { [key: string]: () => void } {
		return {
			'click:.set-age': this.onSetAgeClick
		};
	}

	onSetAgeClick(): void {
		console.log('on age');
	}

	onButtonClick(): void {
		console.log('clicked');
	}

	template(): string {
		return `
            <div>
                <h1>User Form</h1>
                <div>User name: ${this.model.get('name')}</div>
                <div>User age: ${this.model.get('age')}</div>
                <br />
                <input />
                <button>Click me!</button>
                <button class='set-age'>Set random age</button>
            </div>
        `;
	}

	bindEvents(fragment: DocumentFragment): void {
		const eventsMap = this.eventsMap();

		for (let eventKey in eventsMap) {
			const [ eventName, selector ] = eventKey.split(':');
			fragment.querySelectorAll(selector).forEach((el) => {
				el.addEventListener(eventName, eventsMap[eventKey]);
			});
		}
	}

	render(): void {
		const templateElemenet = document.createElement('template');
		templateElemenet.innerHTML = this.template();

		this.bindEvents(templateElemenet.content);
		this.parent.append(templateElemenet.content);
	}
}
