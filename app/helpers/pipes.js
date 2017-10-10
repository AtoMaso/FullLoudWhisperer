"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// used only when the data pased is object
var core_1 = require('@angular/core');
// articles pipes
var SortTitlePipe = (function () {
    function SortTitlePipe() {
    }
    SortTitlePipe.prototype.transform = function (value, args) {
        if (!value || !value.sort) {
            return value;
        }
        if (args !== null) {
            if (args[0] === 'A') {
                return value.sort(function (a, b) {
                    if (a.Title < b.Title) {
                        return -1;
                    }
                    if (a.Title > b.Title) {
                        return 1;
                    }
                    return 0;
                });
            }
            else {
                return value.sort(function (a, b) {
                    if (a.Title > b.Title) {
                        return -1;
                    }
                    if (a.Title < b.Title) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
        else {
            return value;
        }
    };
    SortTitlePipe = __decorate([
        core_1.Pipe({ name: 'SortArticlesTitle' }), 
        __metadata('design:paramtypes', [])
    ], SortTitlePipe);
    return SortTitlePipe;
}());
exports.SortTitlePipe = SortTitlePipe;
var SortCategoryPipe = (function () {
    function SortCategoryPipe() {
    }
    SortCategoryPipe.prototype.transform = function (value, args) {
        if (!value || !value.sort) {
            return value;
        }
        if (args !== null) {
            if (args === 'A') {
                return value.sort(function (a, b) {
                    if (a.CategoryName < b.CategoryName) {
                        return -1;
                    }
                    if (a.CategoryName > b.CategoryName) {
                        return 1;
                    }
                    return 0;
                });
            }
            else {
                return value.sort(function (a, b) {
                    if (a.CategoryName > b.CategoryName) {
                        return -1;
                    }
                    if (a.CategoryName < b.CategoryName) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
        else {
            return value;
        }
    };
    SortCategoryPipe = __decorate([
        core_1.Pipe({ name: 'SortArticlesCategory' }), 
        __metadata('design:paramtypes', [])
    ], SortCategoryPipe);
    return SortCategoryPipe;
}());
exports.SortCategoryPipe = SortCategoryPipe;
var SortNamePipe = (function () {
    function SortNamePipe() {
    }
    SortNamePipe.prototype.transform = function (value, args) {
        if (!value || !value.sort) {
            return value;
        }
        if (args !== null) {
            if (args === 'A') {
                return value.sort(function (a, b) {
                    if (a.AuthorName < b.AuthorName) {
                        return -1;
                    }
                    if (a.AuthorName > b.AuthorName) {
                        return 1;
                    }
                    return 0;
                });
            }
            else {
                return value.sort(function (a, b) {
                    if (a.AuthorName > b.AuthorName) {
                        return -1;
                    }
                    if (a.AuthorName < b.AuthorName) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
        else {
            return value;
        }
    };
    SortNamePipe = __decorate([
        core_1.Pipe({ name: 'SortArticlesName' }), 
        __metadata('design:paramtypes', [])
    ], SortNamePipe);
    return SortNamePipe;
}());
exports.SortNamePipe = SortNamePipe;
var SortDatePipe = (function () {
    function SortDatePipe() {
    }
    SortDatePipe.prototype.transform = function (value, args) {
        if (!value || !value.sort) {
            return value;
        }
        if (args !== null) {
            if (args === 'A') {
                return value.sort(function (a, b) {
                    if (a.DatePublished < b.DatePublished) {
                        return -1;
                    }
                    if (a.DatePublished > b.DatePublished) {
                        return 1;
                    }
                    return 0;
                });
            }
            else {
                return value.sort(function (a, b) {
                    if (a.DatePublished > b.DatePublished) {
                        return -1;
                    }
                    if (a.DatePublished < b.DatePublished) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
        else {
            return value;
        }
    };
    SortDatePipe = __decorate([
        core_1.Pipe({ name: 'SortArticlesDate' }), 
        __metadata('design:paramtypes', [])
    ], SortDatePipe);
    return SortDatePipe;
}());
exports.SortDatePipe = SortDatePipe;
var TopArticlesPipe = (function () {
    function TopArticlesPipe() {
    }
    TopArticlesPipe.prototype.transform = function (value, args) {
        if (args !== null) {
            return value.slice(0, args);
        }
        else {
            return value.slice(0, 3);
        }
    };
    TopArticlesPipe = __decorate([
        core_1.Pipe({ name: 'TopArticles' }), 
        __metadata('design:paramtypes', [])
    ], TopArticlesPipe);
    return TopArticlesPipe;
}());
exports.TopArticlesPipe = TopArticlesPipe;
// authors pipes
var SortAuthorsPipe = (function () {
    function SortAuthorsPipe() {
    }
    SortAuthorsPipe.prototype.transform = function (value, args) {
        if (!value || !value.sort) {
            return value;
        }
        return value.sort(function (a, b) {
            if (a.Name < b.Name) {
                return -1;
            }
            if (a.Name > b.Name) {
                return 1;
            }
            return 0;
        });
    };
    SortAuthorsPipe = __decorate([
        core_1.Pipe({ name: 'SortedAuthors' }), 
        __metadata('design:paramtypes', [])
    ], SortAuthorsPipe);
    return SortAuthorsPipe;
}());
exports.SortAuthorsPipe = SortAuthorsPipe;
// teams pipes
// general pipes
var InitCapsPipe = (function () {
    function InitCapsPipe() {
    }
    InitCapsPipe.prototype.transform = function (value, args) {
        return value
            .toLowerCase()
            .replace(/(?:^|\s)[a-z]/g, function (m) {
            return m.toUpperCase();
        });
    };
    InitCapsPipe = __decorate([
        core_1.Pipe({ name: 'InitCaps' }), 
        __metadata('design:paramtypes', [])
    ], InitCapsPipe);
    return InitCapsPipe;
}());
exports.InitCapsPipe = InitCapsPipe;
var CapsPipe = (function () {
    function CapsPipe() {
    }
    CapsPipe.prototype.transform = function (value, args) {
        if (args != null) {
            if (args === 'L') {
                return value.toLowerCase();
            }
            else {
                return value.toUpperCase();
            }
        }
        else {
            // default to upper case with no argument
            return value.toUpperCase();
        }
    };
    CapsPipe = __decorate([
        core_1.Pipe({ name: 'Caps' }), 
        __metadata('design:paramtypes', [])
    ], CapsPipe);
    return CapsPipe;
}());
exports.CapsPipe = CapsPipe;
//@Pipe({ name: 'values' })
//class ValuesPipe implements PipeTransform {
//    transform(value: any, args?: any[]): Object[] {
//        let keyArr = Object.keys(value),
//            dataArr = [],
//            keyName = args[0];
//        keyArr.forEach(key => {
//            value[key][keyName] = key;
//            dataArr.push(value[key])
//        });
//        if (args[1]) {
//            dataArr.sort((a: Object, b: Object): number => {
//                return a[keyName] > b[keyName] ? 1 : -1;
//            });
//        }
//        return dataArr;
//    }
//}
//# sourceMappingURL=pipes.js.map