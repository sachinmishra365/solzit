import {Alert, Platform} from 'react-native';
import {
  check,
  checkMultiple,
  Permission,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

const PLATFORM_CAMERA_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
  web: undefined,
  windows: PERMISSIONS.WINDOWS.WEBCAM,
  macos: undefined,
};
const PLATFORM_READ_MEDIA_IMAGES_PERMISSIONS = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
  web: undefined,
  windows: PERMISSIONS.WINDOWS.DOCUMENTS_LIBRARY,
  macos: undefined,
};
const PLATFORM_CALENDER_PERMISSIONS = {
  ios: PERMISSIONS.IOS.CALENDARS,
  android: PERMISSIONS.ANDROID.WRITE_CALENDAR,
  web: undefined,
  windows: undefined,
  macos: undefined,
};
const PLATFORM_LOCATION_PERMISSIONS = {
  ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  web: undefined,
  windows: PERMISSIONS.WINDOWS.LOCATION,
  macos: undefined,
};

const PLATFORM_FILESYSTEM_PERMISSIONS = {
  ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
  android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
  web: undefined,
  windows: PERMISSIONS.WINDOWS.DOCUMENTS_LIBRARY,
  macos: undefined,
};
const PLATFORM_PHOTOS_PERMISSIONS = {
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
};

const REQUEST_PERMISSION_TYPE: any = {
  camera: PLATFORM_CAMERA_PERMISSIONS,
  location: PLATFORM_LOCATION_PERMISSIONS,
  filesystem: PLATFORM_FILESYSTEM_PERMISSIONS,
  photos: PLATFORM_PHOTOS_PERMISSIONS,
  calender: PLATFORM_CALENDER_PERMISSIONS,
};

enum PERMISSION_TYPE {
  camera = 'camera',
  location = 'location',
  filesystem = 'filesystem',
  photos = 'photos',
  calender = 'calender',
}

class AppPermission {
  checkPermission = async (type: PERMISSION_TYPE): Promise<boolean> => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    if (!permissions) {
      return true;
    }
    try {
      const result = await check(permissions);
      if (result === RESULTS.GRANTED) {
        return true;
      }
      return this.requestPermission(permissions);
    } catch (error) {
      return false;
    }
  };
  requestPermission = async (permissions: Permission): Promise<boolean> => {
    try {
      const result = await request(permissions);
      return result === RESULTS.GRANTED;
    } catch (error) {
      return false;
    }
  };

  requestAllPermissions = async () => {
    const iosPerm = [
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
      //   PERMISSIONS.IOS.CALENDARS,
    ];
    const androidPerm = [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      //   PERMISSIONS.ANDROID.WRITE_CALENDAR,
    ];
    const response = await requestMultiple(
      Platform.OS == 'android' ? androidPerm : iosPerm,
    ).then(result => {
      return result;
    });
    return response;
  };

  checkAllPermissions = async () => {
    const iosPerm = [
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.MEDIA_LIBRARY,
      //   PERMISSIONS.IOS.CALENDARS,
    ];
    const androidPerm = [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      //   PERMISSIONS.ANDROID.WRITE_CALENDAR,
    ];
    const response = await checkMultiple(
      Platform.OS == 'android' ? androidPerm : iosPerm,
    ).then(result => {
      if (Platform.OS === 'android') {
        return result[PERMISSIONS.ANDROID.CAMERA] === 'granted';
      } else {
        return (
          result[PERMISSIONS.IOS.CAMERA] === 'granted' &&
          result[PERMISSIONS.IOS.PHOTO_LIBRARY] === 'granted'
        );
      }
    });
    return response;
  };
}

const PermissionHandler = new AppPermission();
export {PermissionHandler, PERMISSION_TYPE};
