import React, {useState, useEffect} from 'react'; 
import { ScrollView, KeyboardAvoidingView, View, UserType, Text, Platform } from 'react-native';
import * as Location from 'expo-location';
import styles from './styles/authStyles';  
import ScreenTitle from '../components/ScreenTitle'; 
import Input from '../components/Input';  
import Button from '../components/Button';  
import Loader from '../components/Loader';  
import Alert from '../components/Alert';  
// import CheckBox from '@react-native-community/checkbox';
import Checkbox from 'expo-checkbox'; 
import axios from '../config/axios'; 
import { SIGNUP_URL } from '../config/urls'; 


function SignUpScreen(props) { 
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        phone: '',
        address: '',
        workingHours: '',
        userType: false,
        location: null
    });

    const [location, setLocation] = useState(null);
    const [isLoading, setLoading] = useState(false); 
    const [alert, setAlert] = useState({messages: null, type: ''}); 

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert({messages: null});

        }, 3000);
      return () => clearTimeout(timer);   
    }, [alert.messages]); 

    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        })();
      }, []);

    const validate = () => {
        const { name, email, password,  specialization, address, workingHours, phone, userType } = formData; 
        let validationErrors = [];
        let passed = true;
        if (!name) {
            validationErrors.push("الرجاء إدخال الاسم");
            passed = false; 
        }
        
        if (!email){
            validationErrors.push("الرجاء إدخال البريد الإلكتروني "); 
            passed = false; 
        }

        if (!password){
            validationErrors.push("الرجاء إدخال كلمة المرور");
            passed = false; 
        }

        if (userType){
         if (!specialization){
            validationErrors.push("الرجاء إدخال التخصص");
            passed = false;  
         }
        
        if (!address){ 
            validationErrors.push("الرجاء إدخال العنوان");
            passed = false; 
        }


        if (!workingHours){
            validationErrors.push("الرجاء إدخال ساعات العمل");
            passed = false; 
        }
        
        if (!phone){
            validationErrors.push("الرجاء إدخال رقم الهاتف");
            passed = false; 
        }    
    }
     
     if (validationErrors.length > 0){
        setAlert({messages: validationErrors, type: 'danger'});  
      }
    return passed;

}   
    
    const changeFormValue = (key, value) => {
     setFormData({...formData, [key]: value}); 
    }

    

    const _signUp = () => {
       if (!validate()) return; 
        (async () => { 
            setLoading(true);
            const { name, email, password, specialization, address, workingHours, phone, userType } = formData; 
            const body = {
                name,
                email,
                password,
                userType: userType ? 'doctor' : 'normal',
                specialization,
                address,
                phone,
                workingHours,
                location: {
                latitude: location ? location.coords.latitude : null,
                 longitude: location ? location.coords.longitude : null,
                }
            }

            try {
           
               const response =  axios.post(SIGNUP_URL, body); 

               setFormData({
                name: '',
                email: '',
                password: '',
                specialization: '',
                address: '',
                phone: '',
                workingHours: '',
                location: null,
                userType: false 
               })

               setLoading(false);
               props.navigation.navigate('SignIn');
            }catch(e){
             setAlert({messages: e.response.data.message, type: 'danger'}); 
             setLoading(false); 
            }

        })();  
    } 
     
    const { name, email, password,  specialization, address, workingHours, phone, userType } = formData; 

      return ( 

        <ScrollView contentContainerStyle={{paddingVertical: 40}}>

            <Loader title="جاري إنشاء حساب جديد" loading={isLoading} />

            <Alert messages={alert.messages} type={alert.type} /> 

            <View style={styles.container}>

            <ScreenTitle title="أنشاء حساب جديد" icon="md-person-add" />

            <KeyboardAvoidingView behavior="padding" enabled>

                <Input 

                placeholder="الأسم"

                value={name}

                onChangeText={(text) => changeFormValue('name', text)} 

                />


                <Input placeholder="البريد الإلكتروني"

                  value={email}

                  onChangeText={(text) => changeFormValue('email', text)} 

                />

                <Input secureTextEntry

                 placeholder="كلمة المرور" 

                 value={password} 

                 onChangeText={(text) => changeFormValue('password', text)} 

                 />

                <View style={styles.checkboxContainer}> 

                <Checkbox 

                 style={styles.checkbox} 

                value={userType}

               onValueChange={()=> changeFormValue('userType', !userType)}

                />

                    <Text style={styles.checkboxLabel}>طبيب</Text>

                </View>

                {userType && (

             <React.Fragment>

                <Input 

                placeholder="التخصص"

                value={specialization}

                onChangeText={(text) => changeFormValue('specialization', text)} 

                />

                <Input 

                placeholder="ساعات العمل" 

                value={workingHours}

                onChangeText={(text) => changeFormValue('workingHours', text)} 

                />

                <Input 

                placeholder="العنوان" 

                value={address}

                onChangeText={(text) => changeFormValue('address', text)} 

                />

                <Input 

                placeholder="الهاتف" 

                value={phone} 

                onChangeText={(text) => changeFormValue('phone', text)} 

                />

            </React.Fragment>

                )}

                <Button text="إنشاء"  onPress={_signUp} />

            </KeyboardAvoidingView>

            </View>

        </ScrollView>

      
      )  

}


export default SignUpScreen; 