// used only when the data pased is object
import { Pipe, PipeTransform } from '@angular/core';
import { Article, ApplicationUser, Team } from './classes';


// articles pipes
@Pipe({ name: 'SortArticlesTitle'})
class SortTitlePipe implements PipeTransform {
    transform(value: Article[], args: any[]) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args[0] === 'A') {
                return value.sort((a: Article, b: Article) => {
                    if (a.Title < b.Title) { return -1; }
                    if (a.Title > b.Title) { return 1; }
                    return 0;
                });
            }
            else {
                return value.sort((a: Article, b: Article) => {
                    if (a.Title > b.Title) { return -1; }
                    if (a.Title < b.Title) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }
    }
}

@Pipe({ name: 'SortArticlesCategory' })
class SortCategoryPipe implements PipeTransform {
    transform(value: Article[], args: any) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args === 'A') {

                return value.sort((a: Article, b: Article) => {
                  if (a.CategoryName < b.CategoryName) { return -1; }
                  if (a.CategoryName > b.CategoryName) { return 1; }
                    return 0;
                });
            }
            else {

                return value.sort((a: Article, b: Article) => {
                  if (a.CategoryName > b.CategoryName) { return -1; }
                  if (a.CategoryName < b.CategoryName) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }

    }
}

@Pipe({ name: 'SortArticlesName' })
class SortNamePipe implements PipeTransform {
    transform(value: Article[], args: any) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args === 'A') {

                return value.sort((a: Article, b: Article) => {
                  if (a.AuthorName < b.AuthorName) { return -1; }
                  if (a.AuthorName > b.AuthorName) { return 1; }
                    return 0;
                });
            }
            else {

                return value.sort((a: Article, b: Article) => {
                  if (a.AuthorName > b.AuthorName) { return -1; }
                  if (a.AuthorName < b.AuthorName) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }

    }
}

@Pipe({ name: 'SortArticlesDate' })
class SortDatePipe implements PipeTransform {
    transform(value: Article[], args: any) {

        if (!value || !value.sort) { return value; }

        if (args !== null) {
            if (args === 'A') {

                return value.sort((a: Article, b: Article) => {
                  if (a.DatePublished < b.DatePublished) { return -1; }
                  if (a.DatePublished > b.DatePublished) { return 1; }
                    return 0;
                });
            }
            else {

                return value.sort((a: Article, b: Article) => {
                  if (a.DatePublished > b.DatePublished) { return -1; }
                  if (a.DatePublished < b.DatePublished) { return 1; }
                    return 0;
                });
            }
        }
        else {
            return value;
        }

    }
}

@Pipe({ name: 'TopArticles' })
class TopArticlesPipe implements PipeTransform {
    transform(value: Article[], args: any) {

        if (args !== null) {
            return value.slice(0, args);
        }
        else {
            return value.slice(0, 3);
        }
    }
}


// authors pipes
@Pipe({ name: 'SortedAuthors' })
class SortAuthorsPipe implements PipeTransform {
    transform(value: ApplicationUser[], args: any) {

        if (!value || !value.sort) { return value; }

        return value.sort((a: ApplicationUser, b: ApplicationUser) => {
            if (a.Name < b.Name) { return -1; }
            if (a.Name > b.Name) { return 1; }
            return 0;
        });
    }
}


// teams pipes


// general pipes
@Pipe({ name: 'InitCaps' })
class InitCapsPipe implements PipeTransform {
    transform(value: string, args: any) {
        return value
            .toLowerCase()
            .replace(/(?:^|\s)[a-z]/g, function (m) {
                return m.toUpperCase();
            });
    }
}

@Pipe({ name: 'Caps' })
class CapsPipe implements PipeTransform {
    transform(value: string, args: any) {
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
    }
}

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

export {
        SortDatePipe,
        SortTitlePipe,
        SortNamePipe,
        SortCategoryPipe,
        TopArticlesPipe,
        SortAuthorsPipe,
        InitCapsPipe,
        CapsPipe}
