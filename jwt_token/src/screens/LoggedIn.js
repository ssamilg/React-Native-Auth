import React, { Component, Fragment } from 'react';
import { View, Text } from 'react-native';
import { Button, Loading } from '../components/common/';
import axios from 'axios';

export default class LoggedIn extends Component {
  constructor(props){
    super(props);
    this.state = {
        loading: true,
        posts: {
            title: '',
            description:'',
        },
        error: ''
      }
  }
  componentDidMount(){
    const headers = {
      'auth-token': this.props.jwt
    };
    axios({
        method: 'GET',
        url: 'https://sauhub.herokuapp.com/api/posts/',
        headers: headers,
      }).then((response) => {
        this.setState({
          posts: response.data.posts,
          loading: false
        });
      }).catch((error) => {
        this.setState({
          error: 'Error retrieving data',
          loading: false
        });
      });
}

  render() {
    const { container, emailText, errorText } = styles;
    const { loading, posts, error } = this.state;
    if (loading){
        return(
          <View style={container}>
            <Loading size={'large'} />
          </View>
        )
      } else {
          return(
            <View style={container}>
              <View>
                  
                {posts ?
                  <Fragment>
                      <Text style={emailText}>
                        Title: {posts.title}
                      </Text>
                      <Text style={emailText}>
                        Description:{posts.description}
                      </Text>
                  </Fragment>
                  :
                  <Text style={errorText}>
                    {error}
                  </Text>}
              </View>
              <Button onPress={this.props.deleteJWT}>
                Log Out
              </Button>
            </View>
        );
      }
  }
}

const styles = {
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    emailText: {
      alignSelf: 'center',
      color: 'black',
      fontSize: 14
    },
    errorText: {
      alignSelf: 'center',
      fontSize: 18,
      color: 'red'
    }
  };
