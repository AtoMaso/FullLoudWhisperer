import { ArticleInterface, LocalityInterface,
            TeamInterface, CategoryInterface, ContentInterface,
            ApplicationUserInterface, BusinessLineInterface, LevelInterface,
            PositionInterface, AuthenticationInterface, UserIdentityInterface,
            UserSessionInterface, RoleInterface, ImageInterface, ProcessMessageInterface,
            PageTitleInterface, AttachementInterface, TeamMember } from './interfaces';


class Article implements ArticleInterface {
    //Id: number;
    ArticleId: string;
    Title: string;
    Flash: string;
    Content: string;
    DatePublished: Date;
    CategoryName: string;
    ContentText: string;
    AuthorId: string;
    AuthorName: string;
    Attachements: Attachement[] = [];

    // Copy constructor.
    constructor(obj?: Object) {
        if (obj) {
            //this.Id = obj['Id'];
            this.ArticleId = obj['ArticleId'];
            this.Title = obj['Title'];
            this.Flash = obj['Flash'];
            this.Content = obj['Content'];
            this.DatePublished = obj['DatePublished'];
            this.CategoryName = obj['CategoryName'];
            this.ContentText =obj['ContentText'];
            this.AuthorId = obj['AuthorId'];
            this.AuthorName = obj['AuthorName'];
            this.Attachements = obj['Attachements'];
        }
    }

    // map json array to array of articles static method.
    static mapJSONArrayToArticles(array: Array<Object>): Article[] {
        return array.map((obj: Object) => new Article(obj));
    }

    // map json object to article object
    static mapJSONObjectToArticle(obj: Object): Article {
        return new Article(obj);
    }
}


class Team implements TeamInterface {
    TeamId: number;
    TeamName: string;
    TeamDescription: string;
    TeamLeadId: string;
    TeamLead: string;
    ProjectDirectorId: string;
    ProjectDirector: string;
    ProjectManagerId: string;
    ProjectManager: string;
    BusinessLineId: number;
    BusinessLineName: string;
    LocalityId: number;
    LocalityNumber: number;
    LocalityStreet: string;
    LocalitySuburb: string;
    LocalityCity: string;
    LocalityPostcode: number;
    LocalityState: string;

    // Copy constructor.
    constructor(obj?: Object) {
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
    static fromJSONArrayToTeams(array: Array<Object>): Team[] {
        return array.map((obj: Object) => new Team(obj));
    }

    // map json object to team object
    static mapJSONObjectToTeam(obj: Object): Team {
        return new Team(obj);
    }
}


class ApplicationUser implements ApplicationUserInterface {
    Id: string;
    Name: string;
    AtoUsername: string;
    Email: string;
    Role: string;
    Password: string;
    ConfirmPassword: string;
    PhoneNumber: string;
    Workpoint: string;
    Manager: string;
    LevelId: number;
    LevelTitle: string;
    PositionId: number;
    PositionTitle: string
    LocalityId: number;
    LocalityNumber: number;
    LocalityStreet: string;
    LocalitySuburb: string;
    LocalityCity: string;
    LocalityPostcode: number;
    LocalityState: string;
    TeamId: number;
    TeamName: string;
  

    // Copy constructor. Maybe we need to be an array of Authors for an article
    constructor(obj?: Object) {
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
    static fromJSONArrayToApplicationUsers(array: Array<Object>): ApplicationUser[] {
        return array.map((obj: Object) => new ApplicationUser(obj));
    }

    // map json object to memebr object
    static mapJSONObjectToUser(obj: Object): ApplicationUser {
        return new ApplicationUser(obj);
    }
}

class Locality implements LocalityInterface {
    LocalityId: number;
    Number: number;
    Street: string;
    Suburb: string;
    City: string;
    Postcode: number
    State: string;

    // Copy constructor.
    constructor(obj?: Object) {
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
    static fromJSONArrayToLocalities(array: Array<Object>): Locality[] {
        return array.map((obj: Object) => new Locality(obj));
    }

    // map json object to locality object
    static mapJSONObjectToLocality(obj: Object): Locality {
        return new Locality(obj);
    }

}

class Category implements CategoryInterface {
    CategoryId: number;
    CategoryName: string;

    // Copy constructor.
    constructor(obj?: Object) {
        if (obj) {
            this.CategoryId = obj['CategoryId'];
            this.CategoryName = obj['CategoryName'];
        }
    }

    // map the json array to array of categories
    static fromJSONArrayToCategories(array: Array<Object>): Category[] {
        return array.map((obj: Object) => new Category(obj));
    }

    // map json object to category object
    static mapJSONObjectToCategory(obj: Object): Category {
        return new Category(obj);
    }
}

class Content implements ContentInterface {
    ContentId: number;
    ContentText: string;

    // Copy constructor.
    constructor(obj?: Object) {
        if (obj) {
            this.ContentId = obj['ContentId'];
            this.ContentText = obj['ContentText'];
        }
    }

    // map the json array to array of contents
    static fromJSONArrayToContents(array: Array<Object>): Content[] {
        return array.map((obj: Object) => new Content(obj));
    }

    // map json object to content object
    static mapJSONObjectToContent(obj: Object): Content {
        return new Content(obj);
    }
}

class BusinessLine implements BusinessLineInterface {
    BusinessLineId: number;
    BusinessLineName: string;

    // Copy constructor.
    constructor(obj?: Object) {
        if (obj) {
            this.BusinessLineId = obj['BusinessLineId'];
            this.BusinessLineName = obj['BusinessLineName'];
        }
    }

    // map the json array to array of business lines
    static fromJSONArrayToBusinessLines(array: Array<Object>): BusinessLine[] {
        return array.map((obj: Object) => new BusinessLine(obj));
    }

    // map json object to business line object
    static mapJSONObjectToBusinessLine(obj: Object): BusinessLine {
        return new BusinessLine(obj);
    }
}

class Level implements LevelInterface {
  LevelId: number;
  LevelTitle: string;

  // Copy constructor.
  constructor(obj?: Object) {
    if (obj) {
      this.LevelId = obj['LevelId'];
      this.LevelTitle = obj['LevelTitle'];
    }
  }

  // map the json array to array of levels
  static fromJSONArrayToLevels(array: Array<Object>): Level[] {
    return array.map((obj: Object) => new Level(obj));
  }

  // map json object to level object
  static mapJSONObjectToLevel(obj: Object): Level {
    return new Level(obj);
  }
}

class Position implements PositionInterface {
  PositionId: number;
  PositionTitle: string;

  // Copy constructor.
  constructor(obj?: Object) {
    if (obj) {
      this.PositionId = obj['PositionId'];
      this.PositionTitle = obj['PositionTitle'];
    }
  }

  // map the json array to array of positions
  static fromJSONArrayToPositions(array: Array<Object>): Position[] {
    return array.map((obj: Object) => new Position(obj));
  }

  // map json object to position object
  static mapJSONObjectToPosition(obj: Object): Position {
    return new Position(obj);
  }
}


class TeamMember implements TeamMember {
  TeamId: number;
  Id: string;

  // Copy constructor.
  constructor(obj ?: Object) {
    if (obj) {
      this.TeamId = obj['TeamId'];
      this.Id = obj['Id'];
    }
  }

  // map the json array to array of positions
  static fromJSONArrayToTeamMember(array: Array<Object>): TeamMember[] {
    return array.map((obj: Object) => new TeamMember(obj));
  }

  // map json object to position object
  static mapJSONObjectToTeamMember(obj: Object): TeamMember {
    return new TeamMember(obj);
    }
}

class Attachement implements AttachementInterface {
  AttachementId: number;
  ArticleId: string;
  PhysicalPath: string;
  Name: string;

  // Copy constructor.
  constructor(obj?: Object) {
    if (obj) {
      this.AttachementId = obj['AttachementId'];
      this.ArticleId = obj['ArticleId'];
      this.PhysicalPath = obj['PhysicalPath'];
      this.Name = obj['Name']
    }
  }

  // map the json array to array of positions
  static fromJSONArrayToAttachements(array: Array<Object>): Attachement[] {
    return array.map((obj: Object) => new Attachement(obj));
  }

  // map json object to position object
  static mapJSONObjectToAttachement(obj: Object): Attachement {
    return new Attachement(obj);
  }
}



class UserSession implements UserSessionInterface {
    authentication: Authentication;
    userIdentity: UserIdentity;
    sessionCookie: string;

    constructor() {
        this.authentication = new Authentication();
        this.userIdentity = new UserIdentity();
        this.sessionCookie = "";
    }
}

class Authentication {
    isAuthenticated: boolean;
    authenticationType: string;
    constructor() {
        this.authenticationType = "";
        this.isAuthenticated = false;
    }
}

class UserIdentity implements UserIdentityInterface {
    accessToken: any;
    refreshToken: any;
    accessTokenType: string;
    accessTokenExpiresDate: Date;
    accessTokenExpiresIn: number;
    userName: string;
    name: string;
    userId: string;
    roles: string[] = [];

    constructor() {
        this.accessToken = "";
        this.refreshToken = "";
        this.accessTokenType = "";
        this.accessTokenExpiresDate = new Date();
        this.accessTokenExpiresIn = 0;
        this.name = "";
        this.userId = "";
        this.userName = "";
        this.roles = new Array<string>();
    }


    isInRole(rolename: string): boolean {

        let exists: boolean = false;
        for (var i = 0; i < this.roles.length; i++) {
            if (this.roles[i] === rolename) {
                exists = true;
            }
        }
        return exists;

    }
}

class Role implements RoleInterface {
    roleName: string;
    roleId: number;
    constructor() {
        this.roleId = 0;
        this.roleName = "";
    }
}


class Image implements ImageInterface {
  title: string;
  url: string;
  constructor() {
    this.title = "";
    this.url = "";
  }
}

class ProcessMessage implements ProcessMessageInterface {
  id: string;
  type: string;
  text: string;
  constructor() {
    this.id = "PM1";
    this.type = "error";
    this.text = "An error has occured. Please contact application administration!";
  }
}

class PageTitle implements PageTitleInterface {
        title: string;
        value: string;
 
        constructor(title?: string, value?: string) {
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
}

class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}



export {Article, Team, Locality, Category, Content,
            BusinessLine, Level, Position, ApplicationUser,
            Authentication, UserIdentity, UserSession, Role, Image,
            ProcessMessage, PageTitle, Attachement, Guid, TeamMember};
