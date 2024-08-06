//User routes
import Ask from '../Components/Ask/Ask';
import Author from '../Components/Author/Author';
import Authors from '../Components/Authors/Authors';
// import DetailBook from '../Components/DetailBook/DetailBook';
import Genres from '../Components/Genres/Genres';
import HomePage from '../Components/Home/HomePage';
import Login from '../Components/Login/Login';
import DetailPosts from '../Components/Posts/DetailPost';
import Posts from '../Components/Posts/Posts';
import Profile from '../Components/Profile/Profile';
import Register from '../Components/Register/Register';
import Tags from '../Components/Tags/Tags';
import PageQuestions from '../Components/Questions/page';
import PageDetailQuestion from '../Components/DetailQuestions/page';
import Tag from '../Components/Tag/Tag';
import Updateinfo from '../Components/Updateinfo/Updateinfo';
import Changepass from '../Components/Changepass/Changepass';
import ForGotPass from '../Components/ForgotPass/ForGotPass';
import ResetPass from '../Components/ResetPass/ResetPass';
//Admin routes
import FormAuthor from '../admin/Actions/Authors/FormAuthor';
import ReadAuthors from '../admin/Actions/Authors/ReadAuthor';
import FormBook from '../admin/Actions/Book/FormBook';
import ReadBooks from '../admin/Actions/Book/ReadBooks';
import ReadComments from '../admin/Actions/Comments/ReadComments';
import FormGenres from '../admin/Actions/Genres/FormGenres';
import ReadGenres from '../admin/Actions/Genres/ReadGenres';
import ReadPremiumUser from '../admin/Actions/PremiumUsers/PremiumUsers';
import FormUser from '../admin/Actions/User/FormUser';
import ReadUsers from '../admin/Actions/User/ReadUser';
import Dashboard from '../admin/Components/Dashboard/Dashboard';
import Reports from '../admin/Actions/Reports/Reports';
import ReplItEmbed from '../Components/Edittor/Edittor';
import ReadPosts from '../admin/Actions/Posts/ReadPosts';
import FormPosts from '../admin/Actions/Posts/FormPosts';



const publicRoutes = [
	{ path: '/', component: HomePage },
	{ path: '/login', component: Login },
	{ path: '/register', component: Register },
	{ path: '/user/:id', component: Profile },
	{ path: '/users', component: Authors },
	// { path: '/book/:id', component: DetailBook },
	{ path: '/author/:id', component: Author },
	{ path: '/genres/:id', component: Genres },
	{ path: '/posts', component: Posts },
	{ path: '/posts/:id', component: DetailPosts },
	{ path: '/questions', component: PageQuestions },
	{ path: '/question/:id', component: PageDetailQuestion },
	{ path: '/ask', component: Ask },
	{ path: '/ask/edit/:id', component: Ask },
	{ path: '/tags', component: Tags },
	{ path: '/tags/:id', component: Tag },
	{ path: '/updateinfo/:id', component: Updateinfo },
	{ path: '/Changepass/:id', component: Changepass },
	{ path: '/auth/reset-password', component: ResetPass },
	{ path: 'forgotpassword', component: ForGotPass },
];

const adminRoutes = [
	{ path: '/admin/dashboard', component: Dashboard },
	{ path: '/admin/books', component: ReadBooks },
	{ path: '/admin/books/add-book', component: FormBook },
	{ path: '/admin/books/edit-book/:id', component: FormBook },
	{ path: '/admin/genres', component: ReadGenres },
	{ path: '/admin/genres/add-genre', component: FormGenres },
	{ path: '/admin/genres/edit-genre/:id', component: FormGenres },
	{ path: '/admin/user', component: ReadUsers },
	{ path: '/admin/user/add-user', component: FormUser },
	{ path: '/admin/user/edit-user/:id', component: FormUser },
	{ path: '/admin/premium-users', component: ReadPremiumUser },
	{ path: '/admin/authors', component: ReadAuthors },
	{ path: '/admin/author/add-author', component: FormAuthor },
	{ path: '/admin/author/edit-author/:id', component: FormAuthor },
	{ path: '/admin/comments', component: ReadComments },
	{ path: '/admin/reports', component: Reports },
	{ path: '/admin/posts', component: ReadPosts },
	{ path: '/admin/add-posts', component: FormPosts },
	{ path: '/admin/edit-posts/:id', component: FormPosts },
];

export { publicRoutes, adminRoutes };
