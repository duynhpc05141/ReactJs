import axios from "../../config/axiosConfig";
import Cookies from 'js-cookie';


 const handleLogout = async () => {
	const checkauthGGFB = localStorage.getItem('auth');
	if(checkauthGGFB){ 
		localStorage.removeItem('user');
		localStorage.removeItem('auth');
		window.location.href = '/';
		/* empty */ }else{
			try {
				localStorage.removeItem('user');
				localStorage.removeItem('auth');
				
				const token = document.cookie
					.split('; ')
					.find((row) => row.startsWith('token='))
					.split('=')[1];
	
				await axios.post('/auth/logout', {
					refresh_token	:token
				}, {
					headers: {
						token: `Bearer ${token}`,
					},
				});
				Cookies.remove('refreshToken')
				document.cookie =
					'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
				
				window.location.reload()
				
			} catch (error) {
				console.error('Đã xảy ra lỗi khi đăng xuất:', error);
			}
	}
		
	
	};
  


export default handleLogout;