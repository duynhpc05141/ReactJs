import { MediaType, Posts } from "../schemas/post.schema";

export class CreateMediaDto {
  url: string;
  type: MediaType;
}
export class updatePostDto {
  user: string;
  title: string;
  content: string;
  media?: CreateMediaDto[];
  hide?:false
  reply?:Posts[]
}
