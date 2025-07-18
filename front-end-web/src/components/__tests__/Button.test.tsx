import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
    it("renders with the correct label", () => {
        render(<Button label="Click me" />);
        expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("calls onClick when clicked", () => {
        const handleClick = vi.fn();
        render(<Button label="Press" onClick={handleClick} />);
        fireEvent.click(screen.getByText("Press"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
