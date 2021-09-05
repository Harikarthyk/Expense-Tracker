import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { requestHandler } from '../services';
import { API } from '../utils/url';
import { theme } from '../core/theme'
import Loader from "react-native-modal-loader";
import { setAllExpensesCategories, setAllIncomeCategories } from '../redux/action/category';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/AntDesign';
import { FakeCurrencyInput } from 'react-native-currency-input';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput, Snackbar } from 'react-native-paper';
import { setUserToStore } from '../redux/action/user';



const AddTransaction = ({
  navigation,
  user,
  setExpenseCategories,
  setIncomeCategories,
  category,
  setUser,
}) => {
  const [visible, setVisible] = useState('expenses');
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [categoryItems, setCategoryItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');


  // useEffect(()=>{
  //   let arr = category[visible==="income" ? "incomeCategories" : "expenseCategories"].map(item => {
  //     return{
  //       label : item.category,
  //       value : item.category,
  //       icon :() => <Image source={{uri : item.icon}} style={{
  //         padding : 4,height : 50 ,width : 50
  //       }} />
  //     }
  //   });
  //   setCategory([...arr]);
  // },[visible])

  useEffect(async () => {
    try {
      let method = "GET";
      let url_expense = `${API}/category/expense/${user?._id}`;
      let url_income = `${API}/category/income/${user?._id}`;
      let header = {
        'Authorization': `Bearer ${user?.jwtToken}`
      };
      let body = null;
      setIsLoading(true);
      let response_expense = await requestHandler(url_expense, body, header, method);
      let response_income = await requestHandler(url_income, body, header, method);
      setIsLoading(false);
      setExpenseCategories(response_expense?.data);
      setIncomeCategories(response_income?.data);
      let arr = visible === "incomes" ? response_income?.data.categories : response_expense?.data.categories
      arr = arr.map(item => {
        return {
          label: item.category,
          value: item.category,
          icon: () => <Image source={{ uri: item.icon }} style={{
            padding: 4, height: 50, width: 50
          }} />
        }
      });
      setCategoryItems([...arr]);
    } catch (error) {
      setIsLoading(false);
      console.log('-----------------------------------Add Transaction Line 15-------------------------------------');
      console.log(error);
    }
  }, []);
  const switchMode = () => {
    if (visible === "expenses") {
      setVisible("incomes");
    } else {
      setVisible("expenses");
    }
    if (category) {
      let arr = category[visible !== "incomes" ? "incomeCategories" : "expenseCategories"].map(item => {
        return {
          label: item.category,
          value: item.category,
          icon: () => <Image source={{ uri: item.icon }} style={{
            padding: 4, height: 50, width: 50
          }} />
        }
      });
      setCategoryItems([...arr]);
    }
  }

  const addTransaction = async () => {
    if (title.length === 0) {
      ToastAndroid.show('Enter Title to continue', ToastAndroid.SHORT);
      return;
    }
    if (parseInt(price) < 0 || parseInt(price) > 100000) {
      ToastAndroid.show('Price must be min 1');
      return;
    }
    if (value.length === 0) {
      ToastAndroid.show('Mention some category');
      return;
    }
    setIsLoading(true);
    let method = "POST";
    let url = `${API}/${visible === "incomes" ? "income" : "expense"}/add/${user?._id}`;
    let header = {
      'Authorization': `Bearer ${user?.jwtToken}`
    };

    let body = {
      title: title,
      description: description,
      category: value,
      price: price,
      user: user._id
    };
    let response = await requestHandler(url, body, header, method);
    let { data } = response;
    console.log(data);
    if (data.success === true) {
      setTitle('');
      setDescription('');
      setValue('');
      Alert.alert('Success', "Added Successfully");
      const reducer = async (accumulator, currentValue) => {
        console.log(currentValue);
        return await accumulator + currentValue.price
      };
      let date = new Date()
      if (date.getMonth() === user.month) {
        if (visible === "expenses") {
          let arr = user.expenses;
          arr.push(data.expense);
          let totalExpense = await user.expenses.reduce(reducer, 0);
          let newBalance = user.income - totalExpense;
          setUser({ expenses: arr, expense: totalExpense, balance: newBalance })
        } else {
          let arr = user.incomes;
          arr.push(data.income);
          let totalIncomes = await user.incomes.reduce(reducer, 0);
          let newBalance = totalIncomes - user.expense;
          setUser({ incomes: arr, income: totalIncomes, balance: newBalance })
        }

      }

    } else {
      Alert.alert('Error', "something went wrong")

    }
    setIsLoading(false);

  }
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.colors.background

    }}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: theme.colors.background
          // justifyContent: "center"
        }}
      >

        <Loader loading={isLoading} color={theme.colors.primary} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
            marginTop: normalize(20)
          }}
        >
          <Text
            style={{
              fontSize: normalize(21),
              lineHeight: normalize(32.14),
              color: theme.colors.black,
              marginRight: normalize(15),
              textTransform: "capitalize",
              marginBottom: normalize(18)

            }}
          >
            Add {visible}
          </Text>
          <TouchableOpacity
            onPress={switchMode}
          >
            <Icon name="retweet" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior="padding"
          style={{
            backgroundColor: theme.colors.primary,
            width: '90%',
            alignSelf: "center",
            height: normalize(60),
            alignItems: "center",
            justifyContent: "center",
            borderRadius: normalize(10)
          }}
        >
          <FakeCurrencyInput
            value={price}
            onChangeValue={setPrice}
            prefix="$ "
            delimiter=","
            separator="."
            precision={2}
            style={{
              fontSize: normalize(22),
              color: theme.colors.white,
              lineHeight: normalize(36.8)
            }}
            placeholder="Enter the price"
            placeholderTextColor="white"
            onChangeText={(formattedValue) => {
              // setPrice(formattedValue)
            }}
          />

        </KeyboardAvoidingView>
        <Text
          style={{
            color: theme.colors.black,
            fontSize: normalize(14),
            lineHeight: normalize(24.1),
            // textAlign :"center",
            alignSelf: "center",
            width: '90%'
          }}
        >
          Enter the price above
        </Text>
        <TextInput
          value={title}
          maxLength={10}
          onChangeText={text => setTitle(text)}
          label="Title"
          placeholder="Electricity bills, Stipend"
          mode="outlined"
          style={{
            backgroundColor: theme.colors.white,
            width: '90%',
            alignSelf: "center",
            borderWidth: 0,
            borderColor: theme.colors.background,
            marginVertical: normalize(10)
          }}

        />
        <KeyboardAvoidingView behavior={"padding"}>
          <TextInput
            maxLength={35}
            value={description}
            placeholder="Hostel Electricity bills, Freelance Project"

            onChangeText={text => {
              setDescription(text)
            }}
            mode="outlined"
            style={{
              backgroundColor: theme.colors.white,
              width: '90%',
              alignSelf: "center",
              borderWidth: 0,
              borderColor: theme.colors.background,
              marginVertical: normalize(10)
            }}
            multiline={true}
            numberOfLines={5}
            label="Description"
          />
        </KeyboardAvoidingView>
        <DropDownPicker
          open={open}
          value={value}
          items={categoryItems}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setCategoryItems}
          showTickIcon={true}
          showArrowIcon={true}
          zIndex={1000}
          translation={{
            PLACEHOLDER: "Select Category"
          }}
          dropDownContainerStyle={{
            width: '90%',
            alignSelf: "center",
            height: normalize(160),
            borderColor: theme.colors.primary
          }}
          dropDownDirection="TOP"
          style={{
            width: '90%',
            alignSelf: "center",
            marginVertical: normalize(17),
            borderColor: theme.colors.primary
          }}
        />
        <TouchableOpacity
          style={{
            width: "90%",
            alignSelf: "center",
            backgroundColor: theme.colors.primary,
            padding: normalize(4),
            borderRadius: normalize(4),
            height: normalize(55),
            borderRadius: normalize(10),
            justifyContent: "center",
            marginTop: normalize(10)
          }}
          disabled={isLoading}
          onPress={addTransaction}
        >
          <Text
            style={{
              color: theme.colors.white,
              textAlign: "center",
              fontSize: normalize(19),
              lineHeight: normalize(31.22),
              fontWeight: "500",
            }}
          >
            Add {visible === "incomes" ? "Income" : "Expense"
            }
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};


const mapStateToProps = state => ({
  user: state.user,
  category: state.category
});

const mapDispatchToProps = dispatch => ({
  setExpenseCategories: category => dispatch(setAllExpensesCategories(category)),
  setIncomeCategories: category => dispatch(setAllIncomeCategories(category)),
  setUser: data => dispatch(setUserToStore(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTransaction);