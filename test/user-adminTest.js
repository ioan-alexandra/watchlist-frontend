import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import BoardAdmin from "../src/components/board-admin";


afterEach(cleanup);

it("renders correctly react-test-renderer", () => {
    const renderer = new ShallowRenderer();
    renderer.render(<BoardAdmin />);
    const result = renderer.getRenderOutput();
    expect(result).toMatchSnapshot();
});