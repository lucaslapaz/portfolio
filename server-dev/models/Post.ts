export default interface Post{
    id:number;
    user_id?: number; // author id
    name?:string; // author name
    title:string;
    formatted_title:string;
    description: string;
    content:string;
    creation_date:number;
    is_listed?: boolean;
}