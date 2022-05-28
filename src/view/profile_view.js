import { useNavigation } from "@react-navigation/native";
import { Button, Layout, Text } from "@ui-kitten/components";
import { onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/user_slice";
import { USERS_QUERY } from "../service/auth_service";

const ProfileView = () => {
  const { user } = useSelector((state) => state.user);

  const [state, setState] = useState();
  const next = useNavigation();
  const disptach = useDispatch();

  useEffect(() => {
    const unSub = onSnapshot(query(USERS_QUERY), (snap) => {
      const collection = [];
      snap.forEach((doc) => {
        if (doc.id === user?.id) {
          collection.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      setState(collection[0]);
      disptach(
        setUser({
          id: user?.id,
          name: collection[0].fname + " " + collection[0].lname,
          email: collection[0].email,
          fname: collection[0].fname,
          lname: collection[0].lname,
          contact: collection[0].contact,
        })
      );
    });
    return unSub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <React.Fragment>
      <Layout style={{ marginHorizontal: 10 }}>
        <Layout style={style.imgLayout}>
          <Layout>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
              }}
              resizeMode="contain"
              style={style.imgStyle}
            />
          </Layout>
          <Layout style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {state?.fname + " " + state?.lname}
            </Text>
            <Text style={{ fontSize: 12, marginTop: 10 }}>id: {state?.id}</Text>
          </Layout>
        </Layout>

        <Text style={{ fontSize: 18, marginTop: 15 }}>
          Email:{" "}
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {state?.email}
          </Text>
        </Text>

        <Text style={{ fontSize: 18, marginTop: 15 }}>
          Contact No:{" "}
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {state?.contact}
          </Text>
        </Text>

        <Button
          style={{ marginTop: 60, marginBottom: 80 }}
          onPress={() => {
            next.navigate("Register");
          }}
        >
          <Text>Edit Info</Text>
        </Button>
      </Layout>
    </React.Fragment>
  );
};

export default ProfileView;

const style = StyleSheet.create({
  imgLayout: {
    marginBottom: 30,
    textAlign: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  imgStyle: {
    width: 100,
    height: 100,
  },
});
