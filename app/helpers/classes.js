"use strict";
var interfaces_1 = require('./interfaces');
var Article = (function () {
    // Copy constructor.
    function Article(obj) {
        this.Attachements = [];
        if (obj) {
            //this.Id = obj['Id'];
            this.ArticleId = obj['ArticleId'];
            this.Title = obj['Title'];
            this.Flash = obj['Flash'];
            this.Content = obj['Content'];
            this.DatePublished = obj['DatePublished'];
            this.CategoryName = obj['CategoryName'];
            this.ContentText = obj['ContentText'];
            this.AuthorId = obj['AuthorId'];
            this.AuthorName = obj['AuthorName'];
            this.Attachements = obj['Attachements'];
        }
    }
    // map json array to array of articles static method.
    Article.mapJSONArrayToArticles = function (array) {
        return array.map(function (obj) { return new Article(obj); });
    };
    // map json object to article object
    Article.mapJSONObjectToArticle = function (obj) {
        return new Article(obj);
    };
    return Article;
}());
exports.Article = Article;
var Team = (function () {
    // Copy constructor.
    function Team(obj) {
        if (obj) {
            this.TeamId = obj['TeamId'];
            this.TeamName = obj['TeamName'];
            this.TeamDescription = obj['TeamDescription'];
            this.TeamLeadId = obj['TeamLeadId'];
            this.TeamLead = obj['TeamLead'];
            this.ProjectDirectorId = obj['ProjectDirectorId'];
            this.ProjectDirector = obj['ProjectDirector'];
            this.ProjectManager = obj['ProjectManager'];
            this.ProjectManagerId = obj['ProjectManagerId'];
            this.BusinessLineId = obj['BusinessLineId'];
            this.BusinessLineName = obj['BusinessLineName'];
            this.LocalityId = obj['LocalityId'];
            this.LocalityNumber = obj['LocalityNumber'];
            this.LocalityStreet = obj['LocalityStreet'];
            this.LocalitySuburb = obj['LocalitySuburb'];
            this.LocalityCity = obj['LocalityCity'];
            this.LocalityPostcode = obj['LocalityPostcode'];
            this.LocalityState = obj['LocalityState'];
        }
    }
    // map the json array to array of teams
    Team.fromJSONArrayToTeams = function (array) {
        return array.map(function (obj) { return new Team(obj); });
    };
    // map json object to team object
    Team.mapJSONObjectToTeam = function (obj) {
        return new Team(obj);
    };
    return Team;
}());
exports.Team = Team;
var ApplicationUser = (function () {
    // Copy constructor. Maybe we need to be an array of Authors for an article
    function ApplicationUser(obj) {
        if (obj) {
            this.Id = obj['Id'];
            this.Name = obj['Name'];
            this.AtoUsername = obj['AtoUsername'];
            this.Email = obj['Email'];
            this.Role = obj['Role'];
            this.Password = obj['Password'];
            this.ConfirmPassword = obj['ConfirmPassword'];
            this.PhoneNumber = obj['PhoneNumber'];
            this.Workpoint = obj['Workpoint'];
            this.Manager = obj['Manager'];
            this.LevelId = obj['LevelId'];
            this.LevelTitle = obj['LevelTitle'];
            this.PositionId = obj['PositionId'];
            this.PositionTitle = obj['PositionTitle'];
            this.LocalityId = obj['LocalityId'];
            this.LocalityNumber = obj['LocalityNumber'];
            this.LocalityStreet = obj['LocalityStreet'];
            this.LocalitySuburb = obj['LocalitySuburb'];
            this.LocalityCity = obj['LocalityCity'];
            this.LocalityPostcode = obj['LocalityPostcode'];
            this.LocalityState = obj['LocalityState'];
            this.TeamId = obj['TeamId'];
            this.TeamName = obj['TeamName'];
        }
    }
    // map the json array to array of members
    ApplicationUser.fromJSONArrayToApplicationUsers = function (array) {
        return array.map(function (obj) { return new ApplicationUser(obj); });
    };
    // map json object to memebr object
    ApplicationUser.mapJSONObjectToUser = function (obj) {
        return new ApplicationUser(obj);
    };
    return ApplicationUser;
}());
exports.ApplicationUser = ApplicationUser;
var Locality = (function () {
    // Copy constructor.
    function Locality(obj) {
        if (obj) {
            this.LocalityId = obj['LocalityId'];
            this.Number = obj['Number'];
            this.Street = obj['Street'];
            this.Suburb = obj['Suburb'];
            this.City = obj['City'];
            this.Postcode = obj['Postcode'];
            this.State = obj['State'];
        }
    }
    // map the json array to array of localities
    Locality.fromJSONArrayToLocalities = function (array) {
        return array.map(function (obj) { return new Locality(obj); });
    };
    // map json object to locality object
    Locality.mapJSONObjectToLocality = function (obj) {
        return new Locality(obj);
    };
    return Locality;
}());
exports.Locality = Locality;
var Category = (function () {
    // Copy constructor.
    function Category(obj) {
        if (obj) {
            this.CategoryId = obj['CategoryId'];
            this.CategoryName = obj['CategoryName'];
        }
    }
    // map the json array to array of categories
    Category.fromJSONArrayToCategories = function (array) {
        return array.map(function (obj) { return new Category(obj); });
    };
    // map json object to category object
    Category.mapJSONObjectToCategory = function (obj) {
        return new Category(obj);
    };
    return Category;
}());
exports.Category = Category;
var Content = (function () {
    // Copy constructor.
    function Content(obj) {
        if (obj) {
            this.ContentId = obj['ContentId'];
            this.ContentText = obj['ContentText'];
        }
    }
    // map the json array to array of contents
    Content.fromJSONArrayToContents = function (array) {
        return array.map(function (obj) { return new Content(obj); });
    };
    // map json object to content object
    Content.mapJSONObjectToContent = function (obj) {
        return new Content(obj);
    };
    return Content;
}());
exports.Content = Content;
var BusinessLine = (function () {
    // Copy constructor.
    function BusinessLine(obj) {
        if (obj) {
            this.BusinessLineId = obj['BusinessLineId'];
            this.BusinessLineName = obj['BusinessLineName'];
        }
    }
    // map the json array to array of business lines
    BusinessLine.fromJSONArrayToBusinessLines = function (array) {
        return array.map(function (obj) { return new BusinessLine(obj); });
    };
    // map json object to business line object
    BusinessLine.mapJSONObjectToBusinessLine = function (obj) {
        return new BusinessLine(obj);
    };
    return BusinessLine;
}());
exports.BusinessLine = BusinessLine;
var Level = (function () {
    // Copy constructor.
    function Level(obj) {
        if (obj) {
            this.LevelId = obj['LevelId'];
            this.LevelTitle = obj['LevelTitle'];
        }
    }
    // map the json array to array of levels
    Level.fromJSONArrayToLevels = function (array) {
        return array.map(function (obj) { return new Level(obj); });
    };
    // map json object to level object
    Level.mapJSONObjectToLevel = function (obj) {
        return new Level(obj);
    };
    return Level;
}());
exports.Level = Level;
var Position = (function () {
    // Copy constructor.
    function Position(obj) {
        if (obj) {
            this.PositionId = obj['PositionId'];
            this.PositionTitle = obj['PositionTitle'];
        }
    }
    // map the json array to array of positions
    Position.fromJSONArrayToPositions = function (array) {
        return array.map(function (obj) { return new Position(obj); });
    };
    // map json object to position object
    Position.mapJSONObjectToPosition = function (obj) {
        return new Position(obj);
    };
    return Position;
}());
exports.Position = Position;
var TeamMember = (function () {
    // Copy constructor.
    function TeamMember(obj) {
        if (obj) {
            this.TeamId = obj['TeamId'];
            this.Id = obj['Id'];
        }
    }
    // map the json array to array of positions
    TeamMember.fromJSONArrayToTeamMember = function (array) {
        return array.map(function (obj) { return new interfaces_1.TeamMember(obj); });
    };
    // map json object to position object
    TeamMember.mapJSONObjectToTeamMember = function (obj) {
        return new interfaces_1.TeamMember(obj);
    };
    return TeamMember;
}());
exports.TeamMember = interfaces_1.TeamMember;
var Attachement = (function () {
    // Copy constructor.
    function Attachement(obj) {
        if (obj) {
            this.AttachementId = obj['AttachementId'];
            this.ArticleId = obj['ArticleId'];
            this.PhysicalPath = obj['PhysicalPath'];
            this.Name = obj['Name'];
        }
    }
    // map the json array to array of positions
    Attachement.fromJSONArrayToAttachements = function (array) {
        return array.map(function (obj) { return new Attachement(obj); });
    };
    // map json object to position object
    Attachement.mapJSONObjectToAttachement = function (obj) {
        return new Attachement(obj);
    };
    return Attachement;
}());
exports.Attachement = Attachement;
var UserSession = (function () {
    function UserSession() {
        this.authentication = new Authentication();
        this.userIdentity = new UserIdentity();
        this.sessionCookie = "";
    }
    return UserSession;
}());
exports.UserSession = UserSession;
var Authentication = (function () {
    function Authentication() {
        this.authenticationType = "";
        this.isAuthenticated = false;
    }
    return Authentication;
}());
exports.Authentication = Authentication;
var UserIdentity = (function () {
    function UserIdentity() {
        this.roles = [];
        this.accessToken = "";
        this.refreshToken = "";
        this.accessTokenType = "";
        this.accessTokenExpiresDate = new Date();
        this.accessTokenExpiresIn = 0;
        this.name = "";
        this.userId = "";
        this.userName = "";
        this.roles = new Array();
    }
    UserIdentity.prototype.isInRole = function (rolename) {
        var exists = false;
        for (var i = 0; i < this.roles.length; i++) {
            if (this.roles[i] === rolename) {
                exists = true;
            }
        }
        return exists;
    };
    return UserIdentity;
}());
exports.UserIdentity = UserIdentity;
var Role = (function () {
    function Role() {
        this.roleId = 0;
        this.roleName = "";
    }
    return Role;
}());
exports.Role = Role;
var Image = (function () {
    function Image() {
        this.title = "";
        this.url = "";
    }
    return Image;
}());
exports.Image = Image;
var ProcessMessage = (function () {
    function ProcessMessage() {
        this.id = "PM1";
        this.type = "error";
        this.text = "An error has occured. Please contact application administration!";
    }
    return ProcessMessage;
}());
exports.ProcessMessage = ProcessMessage;
var PageTitle = (function () {
    function PageTitle(title, value) {
        if (title) {
            this.title = title;
        }
        else {
            this.title = "Page";
        }
        if (value) {
            this.value = " : " + value;
        }
        else {
            this.value = "";
        }
    }
    return PageTitle;
}());
exports.PageTitle = PageTitle;
var Guid = (function () {
    function Guid() {
    }
    Guid.newGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return Guid;
}());
exports.Guid = Guid;
//# sourceMappingURL=classes.js.map