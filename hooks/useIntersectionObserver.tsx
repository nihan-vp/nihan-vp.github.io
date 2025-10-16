
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
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    if (triggerOnce && targetRef.current) {
                        observer.unobserve(targetRef.current);
                    }
                } else if (!triggerOnce) {
                    setIsIntersecting(false);
                }
            },
            { threshold, rootMargin }
        );

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => {
            if (targetRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(targetRef.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetRef, threshold, rootMargin, triggerOnce]);

    return [targetRef, isIntersecting];
};
