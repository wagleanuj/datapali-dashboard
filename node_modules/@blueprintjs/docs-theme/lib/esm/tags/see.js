/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from "react";
import { DocumentationContextTypes } from "../common/context";
export var SeeTag = function (_a, _b) {
    var value = _a.value;
    var renderType = _b.renderType;
    return (React.createElement("p", null,
        "See: ",
        renderType(value)));
};
SeeTag.contextTypes = DocumentationContextTypes;
SeeTag.displayName = "Docs.SeeTag";
//# sourceMappingURL=see.js.map