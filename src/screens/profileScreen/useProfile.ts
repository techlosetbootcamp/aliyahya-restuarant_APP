import {useEffect, useState} from 'react';
import {Alert, Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as ImagePicker from 'react-native-image-picker';

const useProfile = () => {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);

  const user = auth().currentUser;

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setFullName(userData?.name || '');
            setDob(userData?.dob || '');
            setEmail(userData?.email || '');
            setPhone(userData?.phone || '');
            setProfileImage(userData?.profileImage || '');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, []);

  type PickedImage = {
    uri: string;
    base64?: string;
  };

  const pickImage = (): Promise<PickedImage> => {
    return new Promise((resolve, reject) => {
      const options = {
        mediaType: 'photo' as 'photo',
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800,
        quality: 1,
      };

      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          reject('User cancelled image picker');
        } else if (response.errorMessage) {
          reject(`ImagePicker Error: ${response.errorMessage}`);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          resolve({
            uri: asset.uri ?? '',
            base64: asset.base64,
          });
        } else {
          reject('No image data found');
        }
      });
    });
  };

  const handleUpdateProfile = async () => {
    if (!fullName || !dob || !phone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await firestore().collection('users').doc(user?.uid).update({
        name: fullName,
        dob,
        phone,
        profileImage,
      });
      await user?.updateProfile({
        displayName: fullName,
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async () => {
    try {
      const pickedImage = await pickImage();
      setProfileImage(pickedImage.uri);

      const base64Data = pickedImage.base64;
      await firestore().collection('users').doc(user?.uid).update({
        profileImage: base64Data,
      });

      Alert.alert('Success', 'Profile image updated');
    } catch (error) {
      Alert.alert('Error', error as string);
    }
  };

  return {
    fullName,
    setFullName,
    dob,
    setDob,
    email,
    phone,
    setPhone,
    profileImage,
    loading,
    handleUpdateProfile,
    uploadProfileImage,
  };
};

export default useProfile;
