export enum CallType
{
    Register = "Auth/register",
    Activate = "Auth/activate",
    IsActive = "Auth/isActive",
    Login = "Auth/login",
    Validate = "Auth/validate",
    checkPassword = "Auth/checkPassword",
    GetArtists = "Artist/getartists",
    UploadMedia = "Media/Upload",
    GetUser = "Auth/user",
    CreateRoom = "Message/createroom",
    GetRooms = "Message/getrooms",
    GetMessages = "Message/getmessages",
    InsertMessage = "Message/insertmessage",
    GetArtistTypes = "Artist/gettypes",
    GetArtstGenres = "Artist/getgenres",
    BecomeArtist = "Artist/become",
    UpdateArtist =  "Artist/update",
    InsertPost = "Artist/insertpost",  
    RemovePost = "Artist/removepost",
    RemoveArtist = "Artist/removeartist",
    InsertDates = "Artist/insertdates"
}