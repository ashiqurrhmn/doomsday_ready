import assert from "node:assert/strict";
import test from "node:test";

import {
  buildRewatchOrder,
  hasCircularDependency,
} from "../src/services/movieGraph.js";

const movies = [
  { _id: "iron-man", prerequisiteIds: [] },
  { _id: "first-avenger", prerequisiteIds: [] },
  {
    _id: "avengers",
    prerequisiteIds: ["iron-man", "first-avenger"],
  },
  { _id: "civil-war", prerequisiteIds: ["avengers"] },
  { _id: "ragnarok", prerequisiteIds: [] },
  {
    _id: "infinity-war",
    prerequisiteIds: ["civil-war", "ragnarok"],
  },
  { _id: "endgame", prerequisiteIds: ["infinity-war"] },
  { _id: "doomsday", prerequisiteIds: ["endgame"] },
];

test("detects a direct self-dependency", () => {
  assert.equal(
    hasCircularDependency(movies, "iron-man", ["iron-man"]),
    true,
  );
});

test("detects an indirect circular dependency", () => {
  assert.equal(
    hasCircularDependency(movies, "iron-man", ["endgame"]),
    true,
  );
});

test("accepts a valid graph with shared prerequisites", () => {
  assert.equal(
    hasCircularDependency(movies, "infinity-war", [
      "civil-war",
      "ragnarok",
    ]),
    false,
  );
});

test("orders all Doomsday prerequisites once and excludes the target", () => {
  const order = buildRewatchOrder(movies, "doomsday");

  assert.deepEqual(order, [
    "iron-man",
    "first-avenger",
    "avengers",
    "civil-war",
    "ragnarok",
    "infinity-war",
    "endgame",
  ]);
  assert.equal(new Set(order).size, order.length);
  assert.equal(order.includes("doomsday"), false);
});

test("orders Civil War prerequisites before their dependent movie", () => {
  assert.deepEqual(buildRewatchOrder(movies, "civil-war"), [
    "iron-man",
    "first-avenger",
    "avengers",
  ]);
});

test("returns an empty order for a movie without prerequisites", () => {
  assert.deepEqual(buildRewatchOrder(movies, "ragnarok"), []);
});
