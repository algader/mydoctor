import React, {useState, useEffect} from 'react'; 
import { ScrollView, KeyboardAvoidingView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../config/axios'; 
import { SIGNIN_URL } from '../config/urls'; 
import Input from '../components/Input';
import Button from '../components/Button';
import ScreenTitle from '../components/ScreenTitle';
import Loader from '../components/Loader'; 
import Alert from '../components/Alert';  
import styles from './styles/authStyles';


function SignInScreen(props) { 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [isLoading, setLoading] = useState(false);
    const [alert, setAlert] = useState({messages: null, type: ''}); 
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert({messages: null});

        }, 3000);
      return () => clearTimeout(timer);   
    }, [alert.messages]); 

    const changeEmailHandler = (value) => {
        setEmail(value); 
    }

    const changePasswordHandler = (value) => {
        setPassword(value);  
    }

    const validate = () => {
        let validationErrors = [];
        let passed = true;
    
        if (!email) {
          validationErrors.push('الرجاء إدخال البريد الإلكتروني');
          passed = false;
        }
    
        if (!password) {
          validationErrors.push('الرجاء إدخال كلمة المرور');
          passed = false;
        }
    
        if (validationErrors.length > 0) {
          setAlert({ messages: validationErrors, type: 'danger' });
        }
        return passed;
      };


   
      
     


  _signIn = () => {
    (async() => {
        if (!validate()) return; 
        setLoading(true); 

        try{
            const response = await axios.post(SIGNIN_URL, {email, password}); 
            console.log(response.data);
            setLoading(false);
            setEmail('');
            setPassword(''); 
           AsyncStorage.setItem('accessToken', response.data.accessToken); 
            props.navigation.navigate('Home'); 
        }catch(e){
          console.log(response.data);
         setLoading(false);
         setAlert({messages: e.response.data.message, type: 'danger'});
          
        }
    }) (); 
}


// const _signIn = () => {
//   (async () => {
//     if (!validate()) return;

//     setLoading(true);

//     try {
//       const response = await axios.post(SIGNIN_URL, { email, password });
//       setLoading(false);
//       setEmail('');
//       setPassword('');
//       AsyncStorage.setItem('accessToken', response.data.token);
//       props.navigation.navigate('Profile');



return ( 
    <ScrollView contentContainerStyle={{paddingVertical: 40}}>
        <View style={styles.container}>
        <Loader title="جاري إنشاء حساب جديد" loading={isLoading} />
            <Alert messages={alert.messages} type={alert.type} />
            <ScreenTitle title="تسجيل الدخول" icon="md-log-in" />
            <KeyboardAvoidingView behavior="padding" enabled>
                <Input 
                placeholder="البريد الإلكتروني"
                value={email}
                onChangeText={changeEmailHandler} 
                />

               <Input 
                placeholder="كلمة المرور"
                value={password}
                onChangeText={changePasswordHandler}
                secureTextEntry 
                />
                <Button text="دخول" onPress={_signIn} />
            </KeyboardAvoidingView>
        </View>
    </ScrollView> 
 
)
}

export default SignInScreen; 