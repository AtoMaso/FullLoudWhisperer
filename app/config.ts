export let CONFIG = {

    debugKeys: {
      debugOn: false,   
    },

    appKeys: {   
      numberOfImages: 5,
      totalNumberOfImages: 50
    },

    baseUrls: {
        servicebase: 'http://localhost:5700/',
        accounts: 'http://localhost:5700/api/account/',

        articles: 'http://localhost:5700/api/articles',
        updatearticle: 'http://localhost:5700/api/articles/PutArticle',
        adarticle: 'http://localhost:5700/api/articles/PostArticle',
        removearticle: 'http://localhost:5700/api/articles/DeleteArticle',

        authors: 'http://localhost:5700/api/account/GetAuthors',
        author: 'http://localhost:5700/api/account/GetAuthor',
        updateauthor: 'http://localhost:5700/api/account/PutAuthor',
        addauthor: 'http://localhost:5700/api/account/PostAuthor',
        removeauthor: 'http://localhost:5700/api/account/DeleteAuthor',

        members: 'http://localhost:5700/api/account/GetMembers',
        member: 'http://localhost:5700/api/account/GetMember',       
        updatemember: 'http://localhost:5700/api/account/PutMember',
        addmember: 'http://localhost:5700/api/account/PostMember',
        removemember: 'http://localhost:5700/api/account/DeleteMember',

        users: 'http://localhost:5700/api/account/GetUsers',
        user: 'http://localhost:5700/api/account/GetUser',
        updateuser: 'http://localhost:5700/api/account/PutUser',
        adduser: 'http://localhost:5700/api/account/PostUser',
        removeuser: 'http://localhost:5700/api/account/DeleteUser',

        teams: 'http://localhost:5700/api/teams',
        updateteam: 'http://localhost:5700/api/teams/PutTeam',
        addteam: 'http://localhost:5700/api/teams/PostTeam',
        removeteam: 'http://localhost:5700/api/teams/DeleteTeam',

        categories: 'http://localhost:5700/api/categories',
        updatecategory: 'http://localhost:5700/api/categories/PutCategory',
        addcategorie: 'http://localhost:5700/api/categories/PostCategory',
        removecategorie: 'http://localhost:5700/api/categories/DeleteCategory',

        localities: 'http://localhost:5700/api/localities',
        updatelocality: 'http://localhost:5700/api/localities/PutLocality',
        addlocality: 'http://localhost:5700/api/localities/PostLocality',
        removelocality: 'http://localhost:5700/api/localities/DeleteLocality',

        levels: 'http://localhost:5700/api/levels',
        updatelevel: 'http://localhost:5700/api/levels/PutLevel',
        addlevel: 'http://localhost:5700/api/levels/PostLevel',
        removelevel: 'http://localhost:5700/api/levels/RemoveLevel',

        positions: 'http://localhost:5700/api/positions',
        updateposition: 'http://localhost:5700/api/positions/PutPosition',
        addposition: 'http://localhost:5700/api/positions/PostPosition',
        removeposition: 'http://localhost:5700/api/positions/DeletePositions',

        businesslines: 'http://localhost:5700/api/businesslines',
        updatebusinessline: 'http://localhost:5700/api/businesslines/PutBusinessLine',
        addbusinessline: 'http://localhost:5700/api/businesslines/PostBusinessLine',
        removebusinessline: 'http://localhost:5700/api/businesslines/DeleteBusinessLine',

        teammembers: 'http://localhost:5700/api/teammembers',
        updateteammember: 'http://localhost:5700/api/businesslines/PutTeamMember',
        addteammember: 'http://localhost:5700/api/businesslines/PostTeamMember',
        removeteammember: 'http://localhost:5700/api/businesslines/DeleteTeamMember',

        uploads: 'http://localhost:5700/api/uploads',
        uploadsattach: 'http://localhost:5700/api/attachements',
        uploadsphysical: 'http://localhost:5700/uploads'
  }
}
