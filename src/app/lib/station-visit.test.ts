import { describe, expect, it } from "vitest";
import { advanceVisit } from "./station-visit";

describe("station visit detection", () => {
  it("marks arrival inside 75 metres and prompts after departure beyond 100 metres", () => {
    expect(advanceVisit("approaching", 90)).toBe("approaching");
    expect(advanceVisit("approaching", 70)).toBe("arrived");
    expect(advanceVisit("arrived", 85)).toBe("arrived");
    expect(advanceVisit("arrived", 110)).toBe("prompted");
  });

  it("does not prompt someone who never entered the arrival zone", () => {
    expect(advanceVisit("approaching", 150)).toBe("approaching");
  });
});
