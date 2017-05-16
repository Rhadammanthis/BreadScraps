import React from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import Login from './components/Login'
import Artists from './components/Artists'
import SongList from './components/SongList'

const RouterComponent = () =>{
    return(
        <Router sceneStyle={{ paddingTop: 60, backgroundColor: '#191414', flex: 1 }}>
            
            <Scene key="login" component={Login} initial={true} hideNavBar={true}/>
            <Scene key="artists" component={Artists} hideNavBar={true}/>
            <Scene key="songs" component={SongList} hideNavBar={true}/>
            
            {/*<Scene key="auth">
                <Scene key="login" component={Login} title="Plase Login" />
            </Scene>
            <Scene key="main">
                <Scene
                    onRight={() => Actions.employeeCreate()}
                    rightTitle="Add!"
                    key="employeeList" 
                    component={EmployeeList} 
                    title="Employees" 
                    initial
                />
                <Scene key="employeeCreate" component={EmployeeCreate} title="Create Employee" />
                <Scene key="employeeEdit" component={EmployeeEdit} title="Edit Employee" />
            </Scene>*/}
        </Router>
    );
};

export default RouterComponent;