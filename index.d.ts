declare namespace anim {
	export interface AnimationToken { requestId: number; }
	export function fade(element: HTMLElement, opacity: number, opt?: { opacity?: number; callback?: () => void; }): AnimationToken | null | void;
	export function swipeOut(element: HTMLElement, direction: number, opt?: { duration?: number; distance?: number; reset?: boolean; callback?: () => void; }): AnimationToken | null | void;
	export function swipeIn(element: HTMLElement, direction: number, opt?: { duration?: number; distance?: number; reset?: boolean; callback?: () => void; }): AnimationToken | null | void;
	export function slideVertical(element: HTMLElement, show: boolean, opt?: { duration?: number; reset?: boolean; callback?: () => void; }): AnimationToken | null | void;
	export function slideHorizontal(element: HTMLElement, show: boolean, opt?: { duration?: number; reset?: boolean; callback?: () => void; }): AnimationToken | null | void;
	export function stop(token: AnimationToken): boolean;
}

declare namespace array {
	export function binarySearch<T = unknown>(array: ArrayLike<T>, item: unknown, compare: (a: T, b: T) => number): number;
	export function binaryInsert<T = unknown>(array: ArrayLike<T>, item: unknown, compare: (a: T, b: T) => number, duplicate?: boolean): number;
}

declare namespace elem {
	export function create(tagName: string, opt: { className?: string; attributes?: Record<string, string>; events?: Record<string, Function>; children?: HTMLElement[]; text?: string; }): HTMLElement;
	export function append(parent?: HTMLElement, child?: HTMLElement): HTMLElement | null;
	export function remove(child?: HTMLElement, opt?: { events?: Record<string, Function>; }): HTMLElement | null;
	export function empty(element?: HTMLElement): HTMLElement | null;
}

declare namespace obj {
	export interface Definition<T = unknown> {
		default(): T;
		assert(value: unknown): void;
		fromString(value: string): T;
	}
	export type DefaultTypes = "any" | "string" | "?string" | "number" | "?number" | "boolean" | "?boolean" | "object" | "?object"| "function" | "?function" ;
	export function equal(a: unknown, b: unknown): boolean;
	export function update<T = unknown>(target: unknown, source: unknown, definition: Record<string, Definition | Function | DefaultTypes>, strict?: boolean): T | null;
	export function copy<T = unknown>(source: unknown, definition: Record<string, Definition | Function | DefaultTypes>, strict?: boolean): T | null;
}

declare namespace uri {
	export function getQuery(namespace: string): Record<string, object | unknown>;
}

export { anim, array, elem, obj, uri };
