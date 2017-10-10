
interface ArticleInterface{
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
}


interface TeamInterface {
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
}


interface LocalityInterface {
  LocalityId: number;
  Number: number;
  Street: string;
  Suburb: string;
  City: string;
  Postcode: number;
  State: string;
}

interface CategoryInterface {
    CategoryId: number;
    CategoryName: string;
}

interface ContentInterface {
    ContentId: number;
    ContentText: string;
}

interface BusinessLineInterface {
    BusinessLineId: number;
    BusinessLineName: string;
}

interface LevelInterface {
    LevelId: number;
    LevelTitle: string;
}

interface PositionInterface {
    PositionId: number;
    PositionTitle: string;
}


interface ApplicationUserInterface {
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
}

interface UserSessionInterface {
    authentication: AuthenticationInterface;
    userIdentity: UserIdentityInterface;
    sessionCookie: string;
}

interface AuthenticationInterface {
    isAuthenticated: boolean;
    authenticationType: string;
}

interface UserIdentityInterface {
    accessToken: any;
    refreshToken: any;
    accessTokenType: string;
    accessTokenExpiresDate: Date;
    accessTokenExpiresIn: number;
    userName: string;
    name: string;
    userId: string;
    roles: string[];
    isInRole(rolename: string):boolean;
}

interface RoleInterface {
    roleName: string;
    roleId: number;
}


 interface ImageInterface {
  title: string;
  url: string;
}

 interface ProcessMessageInterface {
  id: string;
  type: string;
  text: string;
}

 interface PageTitleInterface { 
  title: string;
  value: string;
}


 interface AttachementInterface {
   AttachementId: number;
   ArticleId: string;
   PhysicalPath: string;
   Name: string;
 }


 interface TeamMember {
   teamid: number;
   id: string;
 }


export { ArticleInterface, LocalityInterface,
          TeamInterface, CategoryInterface, ContentInterface,
          BusinessLineInterface, ApplicationUserInterface,
          LevelInterface, PositionInterface,
          UserSessionInterface, AuthenticationInterface,
          UserIdentityInterface, RoleInterface,
          ImageInterface, ProcessMessageInterface,
          PageTitleInterface, AttachementInterface, TeamMember};
