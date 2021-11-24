import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import normalize from 'react-native-normalize';
import { ScrollView } from 'react-native-gesture-handler';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { theme } from '../core/theme';
import { API } from '../utils/url';
import { requestHandler } from '../services';
import MonthPicker from 'react-native-month-year-picker';
import Loader from 'react-native-modal-loader';
const months = ["Jan", "Feb", "March", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


export const ReportScreen = ({ navigation, user }) => {
    const [expenses, setExpenses] = useState({
        isLoading: true,
        data: []
    });
    const [incomes, setIncomes] = useState({
        isLoading: true,
        data: []
    });
    const [year, setYear] = useState({
        isLoading: true,
        data: []
    });
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getExpenseReportDate();
        getIncomeReportDate();
    }, [date]);
    let getExpenseReportDate = async () => {
        var firstDay =
            new Date(date.getFullYear(), date.getMonth(), 1);

        var lastDay =
            new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let method = "POST";
        let url = `${API}/expense/report/${user?._id}`;
        let header = {
            'Authorization': `Bearer ${user?.jwtToken}`
        };
        let body = {
            firstDay: firstDay,
            lastDay: lastDay
        };

        let response = await requestHandler(url, body, header, method, navigation);
        if (!response || response?.data?.success === false) {
            setExpenses({
                isLoading: false,
                data: []
            })
            Alert.alert('Error', 'Something Went Wrong');
        }
        const { data } = response;
        setExpenses({
            isLoading: false,
            data: [...data.expenses]
        })
    }
    let getIncomeReportDate = async () => {
        var firstDay =
            new Date(date.getFullYear(), date.getMonth(), 1);

        var lastDay =
            new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let method = "POST";
        let url = `${API}/income/report/${user?._id}`;
        let header = {
            'Authorization': `Bearer ${user?.jwtToken}`
        };
        let body = {
            firstDay: firstDay,
            lastDay: lastDay
        };

        let response = await requestHandler(url, body, header, method, navigation);
        if (!response || response?.data?.success === false) {
            setExpenses({
                isLoading: false,
                data: []
            })
            Alert.alert('Error', 'Something Went Wrong');
        }
        const { data } = response;
        setIncomes({
            isLoading: false,
            data: [...data.incomes]
        })
    }

    const onValueChange = async (event, newDate) => {

        setShowPicker(false);
        const selectedDate = newDate || date;
        setExpenses({
            isLoading: true,
            data: []
        })
        setIncomes({
            isLoading: true,
            data: []
        })
        setDate(selectedDate);
    }

    const [chart, setChart] = useState('LineChart');

    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}
        >
            <Loader loading={expenses.isLoading || incomes.isLoading} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                    padding: normalize(15)
                }}
            >
                {showPicker && (
                    <MonthPicker
                        onChange={onValueChange}
                        value={date}
                        minimumDate={new Date(2020, 1)}
                        maximumDate={new Date()}
                        locale="en"
                    />
                )}
                <Text
                    style={{
                        color: "gray",
                    }}
                >
                    you can change month and charts.
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around"
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            marginVertical: normalize(5),
                            alignItems: "center",
                            backgroundColor: theme.colors.white,
                            padding: normalize(10),
                            marginBottom: normalize(10),
                            elevation: 1,
                            marginRight: 5,
                            borderRadius: 4
                        }}
                        disabled={expenses.isLoading || incomes.isLoading}
                        onPress={() => {
                            setShowPicker(true);
                        }}
                    >
                        <Text
                            style={{
                                fontSize: normalize(20.12),
                                color: theme.colors.primary,
                                lineHeight: normalize(30.23),
                                paddingHorizontal: normalize(10)
                            }}
                        >
                            {date.getFullYear() + " "}
                            {months[date.getMonth()]}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            marginVertical: normalize(5),
                            alignItems: "center",
                            backgroundColor: theme.colors.white,
                            padding: normalize(10),
                            marginBottom: normalize(10),
                            elevation: 1,
                            marginLeft: 5,
                            borderRadius: 4
                        }}
                        disabled={expenses.isLoading || incomes.isLoading}
                        onPress={() => {
                            if (chart === "BarChart")
                                setChart('LineChart');
                            else
                                setChart('BarChart')
                        }}
                    >
                        <Text
                            style={{
                                fontSize: normalize(20.12),
                                color: theme.colors.primary,
                                lineHeight: normalize(25.23),
                                paddingHorizontal: normalize(10)
                            }}
                        >
                            {chart === "LineChart" ? "Line Chart": "Bar Chart"}
                        </Text>

                    </TouchableOpacity>
                </View>
                <Text
                    style={{
                        fontSize: normalize(20.12),
                        color: theme.colors.black,
                        lineHeight: normalize(26.23),
                        fontWeight: "700",
                    }}
                >
                    Your Expense for this month
                </Text>
                {expenses.isLoading === false && expenses?.data?.length < 2 &&
                    <View
                        style={{
                            height: normalize(150),
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: normalize(20)
                            }}
                        >
                            No suitable Records found
                        </Text>
                    </View>
                }

                {expenses.isLoading === false && expenses?.data?.length > 1 &&
                    <View
                        style={{
                            marginVertical: normalize(20)
                        }}
                    >
                        {chart === "LineChart" ?
                            <LineChart
                                data={{
                                    labels: expenses.data.map(item => item._id),
                                    datasets: [
                                        {
                                            data: expenses.data.map(item => Number(item.total).toFixed(2))
                                        }
                                    ]
                                }}
                                width={Dimensions.get("window").width - 28} // from react-native
                                height={270}
                                yAxisLabel="₹"
                                yAxisSuffix=""
                                yAxisInterval={1} // optional, defaults to 1
                                chartConfig={{
                                    backgroundColor: theme.colors.primary,
                                    backgroundGradientFrom: theme.colors.primary,
                                    // backgroundGradientTo: "#ffa726",
                                    decimalPlaces: 0, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: normalize(4),
                                    },
                                    propsForDots: {
                                        r: "7",
                                        strokeWidth: "1",
                                        stroke: "#ffa726"
                                    }
                                }}
                                style={{
                                    marginVertical: normalize(10),
                                    borderRadius: normalize(7)
                                }}
                            />
                            : 
                            <BarChart
                                data={{
                                    labels: expenses.data.map(item => item._id),
                                    datasets: [
                                        {
                                            data: expenses.data.map(item => Number(item.total).toFixed(2))
                                        }
                                    ]
                                }}
                                width={Dimensions.get("window").width - 28} // from react-native
                                height={270}
                                yAxisLabel="₹"
                                yAxisSuffix=""
                                yAxisInterval={1} // optional, defaults to 1
                                chartConfig={{
                                    backgroundColor: theme.colors.primary,
                                    backgroundGradientFrom: theme.colors.primary,
                                    // backgroundGradientTo: "#ffa726",
                                    decimalPlaces: 0, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: normalize(4),
                                    },
                                    propsForDots: {
                                        r: "7",
                                        strokeWidth: "1",
                                        stroke: "#ffa726"
                                    }
                                }}
                                style={{
                                    marginVertical: normalize(10),
                                    borderRadius: normalize(7)
                                }}
                            />
                        }
                    </View>
                }

                <Text
                    style={{
                        fontSize: normalize(20.12),
                        color: "black",
                        lineHeight: normalize(26.23),
                        fontWeight: "700",
                    }}
                >
                    Your Income for this month
                </Text>
                {incomes.isLoading === false && incomes.data.length <= 1 &&
                    <View
                        style={{
                            height: normalize(150),
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: normalize(20)
                            }}
                        >No suitable Records found</Text>
                    </View>
                }
                {incomes.isLoading === false && incomes.data.length > 1 &&
                    <View
                        style={{
                            marginVertical: normalize(20)
                        }}
                    >
                        {
                            chart === "LineChart" ?

                                <LineChart
                                    data={{
                                        labels: incomes.data.map(item => item._id),
                                        datasets: [
                                            {
                                                data: incomes.data.map(item => Number(item.total))
                                            }
                                        ]
                                    }}

                                    width={Dimensions.get("window").width - 28} // from react-native
                                    height={270}
                                    yAxisLabel="₹"
                                    yAxisSuffix=""
                                    yAxisInterval={1} // optional, defaults to 1
                                    chartConfig={{
                                        backgroundColor: theme.colors.primary,
                                        backgroundGradientFrom: "#eba365",
                                        // backgroundGradientTo: "#ffa726",
                                        decimalPlaces: 0, // optional, defaults to 2dp
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: normalize(10),
                                        },
                                        propsForDots: {
                                            r: "7",
                                            strokeWidth: "3",
                                            stroke: "#ffa726"
                                        }
                                    }}
                                    style={{
                                        marginVertical: normalize(10),
                                        borderRadius: normalize(7)
                                    }}

                                /> :
                                <BarChart
                                    data={{
                                        labels: incomes.data.map(item => item._id),
                                        datasets: [
                                            {
                                                data: incomes.data.map(item => Number(item.total))
                                            }
                                        ]
                                    }}

                                    width={Dimensions.get("window").width - 28} // from react-native
                                    height={270}
                                    yAxisLabel="₹"
                                    yAxisSuffix=""
                                    yAxisInterval={1} // optional, defaults to 1
                                    chartConfig={{
                                        backgroundColor: theme.colors.primary,
                                        backgroundGradientFrom: "#eba365",
                                        // backgroundGradientTo: "#ffa726",
                                        decimalPlaces: 0, // optional, defaults to 2dp
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: normalize(10),
                                        },
                                        propsForDots: {
                                            r: "7",
                                            strokeWidth: "3",
                                            stroke: "#ffa726"
                                        }
                                    }}
                                    bezier
                                    style={{
                                        marginVertical: normalize(10),
                                        borderRadius: normalize(7)
                                    }}

                                />
                        }
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const mapStateToProps = state => ({
    user: state.user,
});
export default connect(mapStateToProps, null)(ReportScreen)
