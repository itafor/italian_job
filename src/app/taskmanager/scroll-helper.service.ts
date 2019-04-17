import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScrollHelperService {
    public observer: IntersectionObserver;
    static canScroll(element: HTMLElement): boolean {
        return element.scrollWidth !== element.clientWidth;
    }

    // so if we can scroll
    // hook up observers

    // watch two elements
    // the first 
    // and the last

    // when taskboard-wrapper donest intercept taskboard

    static options: IntersectionObserverInit = {
        root: document.createElement('div'),
        rootMargin: '0px',
        threshold: [0.0, 0.01] // call callback when element is totally invisible
    }

    static intersecting$: Subject<{elemId: string; intersecting: boolean}> = new Subject();

    static intersectionCallback: IntersectionObserverCallback = function(entries: IntersectionObserverEntry[], observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ScrollHelperService.intersecting$.next({intersecting: true, elemId: entry.target.getAttribute('data-column_id')});
            } else {
                ScrollHelperService.intersecting$.next({intersecting: false, elemId: entry.target.getAttribute('data-column_id')});
            }
        });
    }

    static observer = new IntersectionObserver(ScrollHelperService.intersectionCallback, ScrollHelperService.options);

    public elements: Element[] = [];
    public observe(elem: HTMLElement) {
        ScrollHelperService.observer.observe(elem);
    }

    public getOptions(root: Element, rootMargin: string, threshold: number | number[]): IntersectionObserverInit {
        return {
            root, rootMargin: rootMargin || '0px', threshold
        }
    }

    public checkForChanges(options: IntersectionObserverInit, element: Element): void {
        if (element !== null && element !== undefined) {
            this.observer = new IntersectionObserver(ScrollHelperService.intersectionCallback, options);
            this.observer.observe(element);
            this.elements.push(element);
        }
    }

    public cleanUp(): void {
        if (this.elements.length) {
            this.elements.forEach(elm => {
                this.observer.unobserve(elm);
            })
        }
    }
}

