import React, { useState } from 'react';
import { Dimensions, Text, View, ScrollView } from 'react-native';
import useAppSelector from 'hooks/useAppSelector';
import useAppDispatch from 'hooks/useAppDispatch';
import { createUser, getUser, updateUser, deleteUser } from 'redux/slices/usersSlice';
import { UserScopes } from 'types/users';
import Accordion from 'components/Accordion';
import AppTextInput from 'components/AppTextInput';
import AppButton from 'components/AppButton';
import TextStyles from 'utils/TextStyles';
import BaseView from 'components/BaseView';

const UsersPage = () => {
  const { selectedUser } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const [getId, setGetId] = useState<string>('');
  const handleGetUserSubmit = () => {
    if (!getId) alert('Please enter an id!');
    else {
      dispatch(getUser({ id: getId }));
    }
  };

  const [createEmail, setCreateEmail] = useState<string>('');
  const [createPassword, setCreatePassword] = useState<string>('');
  const [createName, setCreateName] = useState<string>('');
  const handleCreateUserSubmit = () => {
    // Send only if all fields filled in
    if (!createEmail) alert('Please enter an email!');
    else if (!createPassword) alert('Please enter a password!');
    else if (!createName) alert('Please enter a name!');
    else {
      dispatch(createUser({ email: createEmail, password: createPassword, name: createName }));
    }
  };

  const [updateId, setUpdateId] = useState<string>('');
  const [updateEmail, setUpdateEmail] = useState<string>('');
  const [updatePassword, setUpdatePassword] = useState<string>('');
  const [updateName, setUpdateName] = useState<string>('');
  const [updateRole, setUpdateRole] = useState<string>('');
  const handleUpdateUserSubmit = () => {
    if (!updateId) alert('Please enter an id!');
    if (!updateEmail) alert('Please enter an email!');
    else if (!updatePassword) alert('Please enter a password!');
    else if (!updateName) alert('Please enter a name!');
    else if (!updateRole) alert('Please enter a scope!');
    else {
      dispatch(updateUser({ id: updateId, email: updateEmail, password: updatePassword, role: updateRole as UserScopes }));
    }
  };

  const [deleteId, setDeleteId] = useState<string>('');
  const handleDeleteUserSubmit = () => {
    if (!deleteId) alert('Please enter a id!');
    else {
      dispatch(deleteUser({ id: deleteId }));
    }
  };

  return (
    <BaseView logoText={'App Title'}>
      <View
        style={{
          height: '70%',
          width: Dimensions.get('window').width * 0.90,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <ScrollView>
          <Accordion
            title='Get User'
          >
            <View>
              {
                (selectedUser != null)
                  ? <Text style={TextStyles.regular}>Current selected user: {selectedUser.id}, {selectedUser.email}, {selectedUser.name}, {selectedUser.role}</Text>
                  : <Text style={TextStyles.regular}>No selected user currently.</Text>
              }

              <AppTextInput
                onChangeText={(text) => setGetId(text)}
                value={getId}
                placeholder='Type user id'
              />
              <AppButton
                onPress={handleGetUserSubmit}
                title={'Get User'}
              />
            </View>
          </Accordion>
          <Accordion
            title='Create User'
          >
            <View>
              <AppTextInput
                onChangeText={(text) => setCreateEmail(text)}
                value={createEmail}
                placeholder='Type email'
              />
              <AppTextInput
                onChangeText={(text) => setCreatePassword(text)}
                value={createPassword}
                placeholder='Type password'
              />
              <AppTextInput
                onChangeText={(text) => setCreateName(text)}
                value={createName}
                placeholder='Type name'
              />
              <AppButton
                onPress={handleCreateUserSubmit}
                title={'Create User'}
              />
            </View>
          </Accordion>
          <Accordion
            title='Update User'
          >
            <View>
              <AppTextInput
                onChangeText={(text) => setUpdateId(text)}
                value={updateId}
                placeholder='Type id'
              />
              <AppTextInput
                onChangeText={(text) => setUpdateEmail(text)}
                value={updateEmail}
                placeholder='Type email'
              />
              <AppTextInput
                onChangeText={(text) => setUpdatePassword(text)}
                value={updatePassword}
                placeholder='Type password'
              />
              <AppTextInput
                onChangeText={(text) => setUpdateName(text)}
                value={updateName}
                placeholder='Type name'
              />
              <AppButton
                onPress={handleUpdateUserSubmit}
                title={'Update User'}
              />

            </View>
          </Accordion>
          <Accordion
            title='Delete User'
          >
            <View>
              <AppTextInput
                onChangeText={(text) => setDeleteId(text)}
                value={deleteId}
                placeholder='Type id'
              />
              <AppButton
                onPress={handleDeleteUserSubmit}
                title={'Delete User'}
              />
            </View>
          </Accordion>
        </ScrollView>
      </View>
    </BaseView>
  );
};

export default UsersPage;

/*
<Picker
  selectedValue={updateRole}
  onValueChange={(itemValue) => {
    setUpdateRole(itemValue);
  }}
>
  <Picker.Item label={UserScopes.Unverified} value={UserScopes.Unverified} />
  <Picker.Item label={UserScopes.User} value={UserScopes.User} />
  <Picker.Item label={UserScopes.Admin} value={UserScopes.Admin} />
</Picker>
*/