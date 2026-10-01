
import { useState, useEffect, useRef } from 'react';

type IntersectionObserverOptions = {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
};

export const useIntersectionObserver = <T extends HTMLElement>(
    options: IntersectionObserverOptions = {}
): [React.RefObject<T>, boolean] => {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
    const [isIntersecting, setIsIntersecting] = useState(false);
    const targetRef = useRef<T>(null);

    useEffect(() => {
        const currentTarget = targetRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    if (triggerOnce && currentTarget) {
                        observer.unobserve(currentTarget);
                    }
                } else if (!triggerOnce) {
                    setIsIntersecting(false);
                }
            },
            { threshold, rootMargin }
        );

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [threshold, rootMargin, triggerOnce]);

    return [targetRef, isIntersecting];
};
