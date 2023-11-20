"use strict";
// Heavily inspired by the socket io example for event typing
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: interfaces for all server and client events
// Client events:
// - play at time
// - pause at time
// - ended
// 
// Server events:
// - setState
//
//
// 
// The current time can be inferred from the rest. The one problem is that seeking might bring
// things out of sync.. By measuring average RTT you can probably make this a lot more accurate
