export enum ERole {
  GVCN = "GVCN",
  TBT = "TBM",
  ADMIN = "ADMIN",
  // STUDENT = "STUDENT"
}
export enum EUrlRouter {
  SW_AUTH = "/auth",
  SW_DEFAULT = "/",
  SW_TEACHER = "/teacher", // router bat dau voi /teacher
  SW_TBT = "/tbt",
  SW_TBT_GVCN = "/tbt/teacher",
  SW_TBT_TBT = "/tbt/tbt",
  SW_ADMIN = "/admin",
  IS_RECORD = "record", //router co chua url record khong
  IS_INSTRUCTOR = "instructor",
}
