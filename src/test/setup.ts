import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

class MockAudio {
  public loop = false;
  public preload = "auto";

  public constructor(public readonly src: string) {}

  public async play(): Promise<void> {
    return Promise.resolve();
  }

  public pause(): void {
    return;
  }
}

vi.stubGlobal("Audio", MockAudio as unknown as typeof Audio);

vi.stubGlobal(
  "matchMedia",
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
);

class MockIntersectionObserver {
  public constructor(
    private readonly callback: IntersectionObserverCallback
  ) {}

  public observe = (target: Element): void => {
    this.callback(
      [
        {
          isIntersecting: true,
          target
        } as IntersectionObserverEntry
      ],
      this as unknown as IntersectionObserver
    );
  };

  public disconnect = (): void => {
    return;
  };

  public unobserve = (): void => {
    return;
  };

  public takeRecords = (): IntersectionObserverEntry[] => [];

  public root: Element | null = null;
  public rootMargin = "0px";
  public thresholds = [0];
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

Object.defineProperty(Element.prototype, "scrollIntoView", {
  value: vi.fn(),
  writable: true
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
