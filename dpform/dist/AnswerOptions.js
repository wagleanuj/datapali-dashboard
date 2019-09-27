"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var condition_1 = require("./condition");
var valueType_1 = require("./valueType");
var AnswerOptions = /** @class */ (function () {
    function AnswerOptions() {
        this.optionsMap = {};
        this.optionGroupMap = {};
        this.options = [];
        this.opt_count = 0;
        this.group_count = 0;
    }
    AnswerOptions.toJSON = function (a) {
        return {
            optionsMap: a && a.optionsMap ? lodash_1.default.mapValues(a.optionsMap, (function (v) { return optionToJSON(v); })) : {},
            optionGroupMap: a && a.optionGroupMap ? lodash_1.default.mapValues(a.optionGroupMap, function (v) { return optionGroupToJSON(v); }) : {},
        };
    };
    AnswerOptions.fromJSON = function (d) {
        var r = new AnswerOptions();
        r.optionsMap = d.optionsMap ? lodash_1.default.mapValues(d.optionsMap, function (v) { return optionFromJSON(v); }) : {};
        r.optionGroupMap = d.optionGroupMap ? lodash_1.default.mapValues(d.optionGroupMap, function (v) {
            var rr = {
                id: v.id,
                name: v.name,
                appearingCondition: condition_1.QACondition.fromJSON(v.appearingCondition),
                members: v.members.map(function (item) { return r.optionsMap[item.id]; }),
            };
            return rr;
        }) : {};
        return r;
    };
    Object.defineProperty(AnswerOptions.prototype, "SortedOptions", {
        get: function () {
            var grouplessOptions = Object.values(this.optionsMap).filter(function (item) { return !item.groupName; });
            var groups = Object.values(this.optionGroupMap);
            return {
                groups: groups,
                rootOptions: grouplessOptions,
            };
        },
        enumerable: true,
        configurable: true
    });
    AnswerOptions.prototype.addOption = function (option) {
        if (!option) {
            option = { id: 'opt-' + this.opt_count, value: undefined, groupName: undefined };
        }
        this.optionsMap[option.id] = option;
        var groupname = option.groupName;
        if (groupname) {
            var group = this.optionGroupMap[groupname];
            if (!group) {
                group = {
                    id: 'opt-grp-' + this.group_count,
                    name: groupname,
                    appearingCondition: undefined,
                    members: [option],
                };
                this.optionGroupMap[groupname] = group;
                this.group_count++;
            }
            var optionExistInGroup = null;
            if (option && option.id) {
                optionExistInGroup = group.members.find(function (item) {
                    if (option) {
                        return item.id === option.id;
                    }
                    return false;
                });
            }
            if (!optionExistInGroup) {
                group.members.push(option);
            }
        }
        this.opt_count++;
        return this;
    };
    AnswerOptions.prototype.addGroup = function (groupname) {
        var group = {
            id: 'opt-grp' + this.group_count,
            name: groupname || "group-" + this.group_count,
            appearingCondition: undefined, members: [],
        };
        this.optionGroupMap[group.name] = group;
        this.group_count++;
        return group;
    };
    AnswerOptions.prototype.setValueForOption = function (id, newValue) {
        var option = this.optionsMap[id];
        if (option) {
            option.value = newValue;
        }
        return this;
    };
    AnswerOptions.prototype.deleteOption = function (id) {
        var opt = this.optionsMap[id];
        if (opt) {
            delete this.optionsMap[id];
            var groupname = opt.groupName;
            if (groupname) {
                var group = this.optionGroupMap[groupname];
                if (group) {
                    var ind = group.members.findIndex(function (item) { return item.id === id; });
                    if (ind > -1) {
                        group.members.splice(ind, 1);
                    }
                }
            }
        }
        return this;
    };
    AnswerOptions.prototype.assignOptionToGroup = function (optionIds, groupName) {
        var existingGroup = this.optionGroupMap[groupName];
        if (!existingGroup) {
            existingGroup = this.addGroup(groupName);
            this.optionGroupMap[existingGroup.name] = existingGroup;
        }
        var _loop_1 = function (i) {
            var optionId = optionIds[i];
            var option = this_1.optionsMap[optionId];
            var option_group = option.groupName && this_1.optionGroupMap[option.groupName];
            if (existingGroup.members.find(function (item) { return item.id === optionId; })) {
                return "continue";
            }
            // unassign from the group the option is in
            if (option_group) {
                var find = option_group.members.findIndex(function (item) { return item.id === option.id; });
                if (find > -1) {
                    option_group.members.splice(find, 1);
                }
            }
            option.groupName = existingGroup.name;
            existingGroup.members.push(option);
        };
        var this_1 = this;
        for (var i = 0; i < optionIds.length; i++) {
            _loop_1(i);
        }
        return this;
    };
    AnswerOptions.prototype.setConditionForOption = function (optionId, condition) {
        var option = this.optionsMap[optionId];
        if (option) {
            option.appearingCondition = condition;
        }
        return this;
    };
    AnswerOptions.prototype.setConditionForGroup = function (groupname, condition) {
        var group = this.optionGroupMap[groupname];
        if (group) {
            group.appearingCondition = condition;
        }
        return this;
    };
    AnswerOptions.prototype.unassignGroup = function (ids) {
        var _this = this;
        ids.forEach(function (id) {
            var option = _this.optionsMap[id];
            var opt_groupname = option.groupName;
            if (option && opt_groupname) {
                var optgroup = _this.optionGroupMap[opt_groupname];
                if (optgroup) {
                    var ind = optgroup.members.findIndex(function (item) { return item.id === id; });
                    optgroup.members.splice(ind, 1);
                }
            }
            if (option) {
                option.groupName = undefined;
            }
        });
    };
    AnswerOptions.prototype.changeGroupName = function (oldname, newname) {
        var _this = this;
        var group = this.optionGroupMap[oldname];
        var members_ids = group.members.map(function (item) { return item.id; });
        if (members_ids) {
            members_ids.forEach(function (id) {
                var option = _this.optionsMap[id];
                if (option) {
                    option.groupName = newname;
                }
            });
        }
        if (group) {
            group.name = newname;
            var newGroup = lodash_1.default.clone(group);
            delete this.optionGroupMap[oldname];
            this.optionGroupMap[newname] = newGroup;
        }
    };
    AnswerOptions.prototype.deleteGroup = function (name) {
        var _this = this;
        var group = this.optionGroupMap[name];
        if (!group) {
            return this;
        }
        var members_ids = group.members.map(function (item) { return item.id; });
        if (members_ids) {
            members_ids.forEach(function (id) {
                var option = _this.optionsMap[id];
                if (option) {
                    option.groupName = undefined;
                }
            });
        }
        delete this.optionGroupMap[name];
    };
    AnswerOptions.prototype.setOptionTypeFor = function (optionId, newType) {
        var opt = this.optionsMap[optionId];
        if (opt) {
            opt.type = newType;
            opt.value = undefined;
        }
    };
    return AnswerOptions;
}());
exports.AnswerOptions = AnswerOptions;
function optionGroupToJSON(a) {
    return ({
        id: a.id,
        name: a.name,
        appearingCondition: condition_1.QACondition.toJSON(a.appearingCondition),
        members: a.members.map(function (item) { return optionToJSON(item); }),
    });
}
exports.optionGroupToJSON = optionGroupToJSON;
function optionFromJSON(a) {
    var option = {
        groupName: a.groupName,
        appearingCondition: condition_1.QACondition.fromJSON(a.appearingCondition),
        id: a.id,
        value: a.value,
    };
    if (a.type)
        option.type = valueType_1.answerTypeFromJSON(a.type);
    return option;
}
exports.optionFromJSON = optionFromJSON;
function optionToJSON(a) {
    return ({
        appearingCondition: condition_1.QACondition.toJSON(a.appearingCondition),
        type: a.type ? valueType_1.answerTypeToJSON(a.type) : undefined,
        id: a.id,
        value: a.value,
        groupName: a.groupName,
    });
}
exports.optionToJSON = optionToJSON;
