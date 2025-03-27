import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {IMAGES} from '../../constants/images';
import ScreenLayout from '../../components/screenLoyout/ScreenLayout';
import styles from './ProfileScreenStyle';
import Input from '../../components/input/Input';
import auth from '@react-native-firebase/auth';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/type';
import useProfile from './useProfile';

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
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
  } = useProfile();

  const logout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <ScreenLayout
      showBackButton={true}
      topbarProps={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
      }>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <View style={styles.content}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={uploadProfileImage}>
              <Image
                source={profileImage ? {uri: profileImage} : IMAGES.profilep}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={styles.editIconContainer}>
              <TouchableOpacity onPress={uploadProfileImage}>
                <Image source={IMAGES.edit} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="gray"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <Input
              style={styles.input}
              placeholder="DD / MM / YYYY"
              placeholderTextColor="gray"
              value={dob}
              onChangeText={setDob}
              editable={true}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <Input
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="gray"
              keyboardType="email-address"
              value={email}
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="gray"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateProfile}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} onPress={logout}>
            <Text style={styles.updateButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenLayout>
  );
};

export default ProfileScreen;
