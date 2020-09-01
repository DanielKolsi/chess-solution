import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pieces from "../config/staleMate";
import Chess from "../components/Chess";
import { doublePawnPointsHandling } from "../components/Heuristics";

let container = null;

jest.useFakeTimers();

let App = null;

beforeAll(() => {
  App = ({ chess }) => {
    return (
      <div>
        <Chess chess={chess} />
      </div>
    );
  };

  console.log("app = " + App);
});

afterAll(() => {
  console.log("afterAll");
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

beforeEach(() => {
  console.log("beforeEach");
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {});

it("test the div tag", () => {
  expect(container).toEqual(document.createElement("div"));
});

it("test extra points", () => {
  const extraPoints = doublePawnPointsHandling("52⇒36");
  expect(extraPoints).toBe(1);
});
