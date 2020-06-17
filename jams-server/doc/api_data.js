define({ "api": [
  {
    "version": "1.0.0",
    "type": "delete",
    "url": "/api/auth/contacts",
    "title": "Delete a contact",
    "name": "deleteContact",
    "group": "Contacts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "query",
            "optional": false,
            "field": "uri",
            "description": "<p>uri of the contact to delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>successfully deleted contact</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>contact could not be successfully deleted</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/contacts/ContactServlet.java",
    "groupTitle": "Contacts"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/auth/contacts",
    "title": "View contacts",
    "name": "getContact",
    "group": "Contacts",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "body",
            "optional": false,
            "field": "Contact[]",
            "description": "<p>List of contacts for the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[{\n  \"uri\": \"jami://7e3ab29383\",\n  \"displayName\": \"John Doe\"\n}]",
          "type": "json"
        }
      ]
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/contacts/ContactServlet.java",
    "groupTitle": "Contacts"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/api/auth/contacts",
    "title": "Add a contact",
    "name": "putContact",
    "group": "Contacts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "body",
            "optional": false,
            "field": "Contact",
            "description": "<p>JSON representation of the contact object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"uri\": \"jami://7e3ab29383\",\n  \"displayName\": \"John Doe\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>successfully added contact</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>contact could not be successfully added</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/contacts/ContactServlet.java",
    "groupTitle": "Contacts"
  },
  {
    "version": "1.0.0",
    "type": "delete",
    "url": "/api/auth/device",
    "title": "Deactivate a device",
    "name": "deleteDevice",
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "path",
            "optional": false,
            "field": "deviceId",
            "description": "<p>id of the device</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>device successfully deactivated</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>device could not be deactivated</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/device/DeviceServlet.java",
    "groupTitle": "Device"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/auth/device",
    "title": "Get device info",
    "name": "getDevice",
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "path",
            "optional": false,
            "field": "deviceId",
            "description": "<p>id of the device</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "body",
            "optional": false,
            "field": "Device",
            "description": "<p>device information</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"certificate\":\"pem_encoded_certificate\",\n    \"displayName\":\"My Galaxy S8\",\n    \"deviceId\":\"6aec6252ad\",\n    \"revoked\":true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>Device could not be retrieved</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/device/DeviceServlet.java",
    "groupTitle": "Device"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/api/auth/device",
    "title": "Enroll a device",
    "name": "postDevice",
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "body",
            "optional": false,
            "field": "DeviceRegistrationRequest",
            "description": "<p>device registration request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"csr\":\"pem_encoded_csr\",\n    \"deviceName\":\"My Galaxy S8\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "body",
            "optional": false,
            "field": "DeviceRegistrationResponse",
            "description": "<p>registration response</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"certificateChain\":\"pem_encoded_certificate_chain\"\n    \"displayName\":\"John Doe\"\n    \"nameServer\":\"https://mydomain.com\"\n    \"deviceReceipt\": \"device_receipt_object\"\n    \"receiptSignature\":\"receipt_signature_object\"\n    \"userPhoto\":\"base64_encoded_photo\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>Device could not be enrolled</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/device/DeviceServlet.java",
    "groupTitle": "Device"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/api/auth/device",
    "title": "Change the name of a device",
    "name": "putDevice",
    "group": "Device",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "path",
            "optional": false,
            "field": "deviceId",
            "description": "<p>id of the device</p>"
          },
          {
            "group": "Parameter",
            "type": "query",
            "optional": false,
            "field": "deviceName",
            "description": "<p>new name for the device</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>name changed successfully</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>device name could not be changed</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/device/DeviceServlet.java",
    "groupTitle": "Device"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/auth/devices",
    "title": "Get device info",
    "name": "getDevices",
    "group": "Devices",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "body",
            "optional": false,
            "field": "Device",
            "description": "<p>device information</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[{\n    \"certificate\":\"pem_encoded_certificate\",\n    \"displayName\":\"My Galaxy S8\",\n    \"deviceId\":\"6aec6252ad\",\n    \"revoked\":true\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>Device could not be retrieved</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/device/DevicesServlet.java",
    "groupTitle": "Devices"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/auth/directories",
    "title": "Return the list of directories",
    "name": "getDirectories",
    "group": "Directories",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "body",
            "optional": false,
            "field": "AuthModuleKey[]",
            "description": "<p>array of available authentication sources</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[{\n    \"realm\":\"savoirfairelinux\",\n    \"type\":\"LDAP\"\n},\n{\n    \"realm\":\"LOCAL\",\n    \"type\":\"LOCAL\"\n},\n...\n{\n    \"realm\":\"savoirfairelinux-ad\",\n    \"type\":\"AD\"\n}]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>could not return any authentication sources</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/directory/DirectoriesServlet.java",
    "groupTitle": "Directories"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/auth/directory/entry",
    "title": "Return the user's profile within a directory",
    "name": "getDirectoryEntry",
    "group": "Directory_Entries",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "query",
            "optional": true,
            "field": "directory",
            "description": "<p>name of the directory</p>"
          },
          {
            "group": "Parameter",
            "type": "query",
            "optional": true,
            "field": "directoryType",
            "description": "<p>type of the directory</p>"
          },
          {
            "group": "Parameter",
            "type": "query",
            "allowedValues": [
              "vcard"
            ],
            "optional": true,
            "field": "format",
            "defaultValue": "json",
            "description": "<p>output format</p>"
          },
          {
            "group": "Parameter",
            "type": "query",
            "optional": true,
            "field": "username",
            "description": "<p>username we are looking for</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "body",
            "optional": false,
            "field": "UserProfile",
            "description": "<p>json-representation of the user profile</p>"
          },
          {
            "group": "200",
            "type": "body",
            "optional": false,
            "field": "vCard",
            "description": "<p>vcard-representation of the user profile</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"username\":\"jdoe\",\n     \"firstName\":\"John\",\n     \"lastName\":\"Doe\",\n     \"phoneNumber\":\"+1-514-000-0000\",\n     \"phoneNumberExtension\":\"363\",\n     \"mobileNumber\":\"+1-514-000-0000\",\n     \"faxNumber\":\"+1-514-000-0000\",\n     \"profilePicture\":\"base64_encoded_picture\",\n     \"email\":\"jdoe@savoirfairelinux.com\",\n     \"organization\":\"SFL\"\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "BEGIN:VCARD\nVERSION:3.0\nPRODID:ez-vcard 0.10.6\nN:B%C3%A9raud;Adrien\nTEL;TYPE=work:176\nEMAIL;TYPE=work:adrien.beraud@savoirfairelinux.com\nORG:Savoir-faire Linux\nPHOTO;ENCODING=b;TYPE=jpeg:/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwME\n AwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2w\n BDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU\n FBQUFBQUFBQUFBT/wAARCACWAJYDAREAAhEBAxEB/8QAHgAAAQQCAwEAAAAAAAAAAAAAAAYHCA\n kEBQEDCgL/xABEEAABAwMBBAgDBAUKBwAAAAABAgMEAAURBgcSITEIEzhBUWF2tAkUIjJxgaEW\n IyRSkRUlM0JiZKSxwdEmN0OElLLx/8QAGwEAAgMBAQEAAAAAAAAAAAAAAAIBAwQFBgf/xAAnEQ\n ACAgEEAgIDAAMBAAAAAAAAAQIRAwQSITEyQQUTIlFhFCNxsf/aAAwDAQACEQMRAD8AqqoAKALi\n fg6dmXU3q+V7KFWXL5Dx6J2VSMFABQAUAc4oA53FeBoA+eVABigAoAKACgAoAKAPOx0pO01td9\n X3f3rtbo+KK32NjTEBQAUAFAFxPwdOzLqb1fK9lCrLl8h49E7KpGCgAoAOdACI2ubVIWyvT6ZS\n 467jdpaurgW5kZW8rvJ8EjvNUZsqwwurZZCCyPsjbc+kpf1rcflrNvfSclCHsbvkPurzU9dkk7\n XB1Y6WNcHVaenc9Z7gzBvK4chs8n88T9/nWjF8lkfaK56Veh5NH9KKw31lDtwQYrTn9G8ynII8\n SPCtkPkccnU+DLLTyXQ71nvdv1DCTMtk1mdHUAd9lWceRHca6sJRmri7RlacXTMynICgAoAKAP\n Ox0pO01td9X3f3rtbo+KK32NjTEBQAUAFAFxPwdOzLqb1fK9lCrLl8h49E7KpGCgAoA+kpBI3j\n hPefAUA+iAHSI2zi4bSL+5b30vhofJNSSd5DLSTx6rjzUcZPlXmtfq2m1H/h2NPhtKxmbouU5Z\n Vvyoz5akIO7JdBKc+eOP41walKZ2Y43VpEd16fvF0ffbUpTrbTu8jPHAzyz3iu2pQaTiv4UPFJ\n voWWndtFy0LcExb1CnSIycBL7CCUNp8MeVT/AIv3Qbi0mLJOHokr0delijRGo/2h8P2mcQHW1q\n wMHkoedNpsstKlGXRz8+JTVrssT07qKBqyzRrpbH0SIj6d5KkKz+FeijNTVo5LTTpmxpxQoAKA\n POx0pO01td9X3f3rtbo+KK32NjTEBQAUAFAFxPwdOzLqb1fK9lCrLl8h49E7KpGCgAoAazpI65\n c0ds7djRHC1cLqr5VtxJx1aT9o/wAMj8ax6rL9OO/2X4Y75UQzg7NYt9ujE+O2idEiqCpjA+kO\n eJB8q8blcm+VZ6TTR5HCuun7bfkJYLPVQkABDQH5VfDGrO0sbSNXC2PafjOEtQUHfOcCrPrUX+\n ItL2ZmotklmkWdxhEBkhScHKRSylJKkx4KuCK+2LYBJ0laF3qzOLShlQ32cfZ48CKbDqW8lTXZ\n z9VhTtwJl/D72krm2+76LubyzNjstyogVyW2OCsefHNeg0c1LcjzGphtqRMKumYAoAKAPOx0pO\n 01td9X3f3rtbo+KK32NjTEBQAUAFAFxPwdOzLqb1fK9lCrLl8h49E7KpGCgDlIJIA5mgCvrp5b\n aSNZi0sOBLNoHUpGf+oftKNef1Ev8jPsfUTq6eOyG59s1vRq1Im9aFdfDhdcW4QpXjXO1UVDJw\n eg0ytWPDa7GX1lTiwyyT9o0m6naOgp+hQtwLfFwVvBahyxwqx7/aFcWzFukaK83usPgK8M1le9\n vkeKa5Y3utLYp21zWJSQ426ypPEeVJNcNv0VS/PoYfo7bUI+z/a1p64vvIbYakmMtw8uqWdxQP\n 4GurhnLFkhL17OBqce+Mki1dLjbzaHWlhxpxIWhaTwIPEGvUHnTmgAoA87HSk7TW131fd/eu1u\n j4orfY2NMQFABQAUAXE/B07MupvV8r2UKsuXyHj0TsqkYKAOFvCM048QSGkKXgDJ4DNF1yT3wU\n la/eu22LaBeVKdWh6TLdUp5aSQlZUcDHfxrz2KLUt8ket0+nWojKEXVIcTYQxrvZfsNvj7UWNI\n uLFyDZanEhTbZOCseOOeKbVvBPOm+qKsEM+LHt7dhr3a9r+MiKIk+6hlxSWC400hCCvGcgEcuP\n Pyq7S4ceox7lwass5YuGd1n2ta5tk6BCdFx1e5MQ4pMSC1vSWtzG8pQAwU8edafrTtN0kXffLC\n lauxNX3pAa2udt/lG2Ll2+OlS8x1IBcwlRSc8OYIPCpjpYSbgVZNRkcFOK4foU1g23aoctBl3Z\n UibGYQgyIq28O7iuG8kY4nj3VyNRghOaxR7Y6yThi+xojDa9ZSWNS3W3vLKd2Utxre+lSTnOPv\n 8q35tPWKMor0cuGTfKSf7LrOidrtO0LYJpm4Kz81HbMR/PPfT3/nW/A7xo4meO3I0h3a0GcKAP\n Ox0pO01td9X3f3rtbo+KK32NjTEBQAUAFAFxPwdOzLqb1fK9lCrLl8h49E7KpGCgDlKt05oAib\n te6JECwPXrVmlRutOOmbIgEcWj/WUjxHfisWbFUW4nb+M1TxaiO7p8DbbNLAiboSbbrglx8ylk\n yd48VZzgg/hXC1TTkpR/R6nPX3SXo1132RXeYpLab8tEFI3UtyY6VlI7hmmx5ZQVoWMK4sXWwj\n Zta9D3+6Xp2X8zLdiCGiQ6AkBIJJCB3DKqpz5cmRbaHjjt7pcjJ6m2YT7Zqq8i2qiyIz8xcpDL\n 6cBG+cqCVAcsk1ZptS1CpLkdxcW9vRs7Foq4urZbnRocRCFJUpTKytSgk5AGRwrNkk3F/vkz5O\n v4Rts2xG4bRrve7zEhLdnyrksRooT9bgLmPpHPlxrqY5S+rHCL9IwazbiSUlTf8A4W/7CdmjGy\n TZVY9Otg9e00HZKlcy6oDe/wAq7cIbIpHksk98mxe1YVhQB52OlJ2mtrvq+7+9drdHxRW+xsaY\n gKACgAoAuJ+Dp2ZdTer5XsoVZcvkPHonZVIwUAFAGn1m/coukbu7aGW5FwRHUWmnRkL4cRjxxm\n ll4uho9og3sh1Nqm53nVbGoLC9aIcVaBEedYLfXHJ3x4HHDlXn9TCOxbe2z1GHVvPPa/SFHqzV\n rdvjD5hzqWe9XeaxwVM7UJcWM7qdy8TZvz1rddZacTupa68DcHjjNaoRb4o1wcn0jL0NdhZEtQ\n rqp1Ut1RIkOub4JzyrPmhtdxEnKpVQ4Uye2zFkP4A6plbhx5JJrJJ2YsslFWLroENW682G7Xf+\n SerlNubjD6kf0aeR5jmfEV6D4/GoQ2/o8t8lqJajKn6RLUnNdc5JxQAUAedjpSdpra76vu/vXa\n 3R8UVvsbGmICgAoAKALifg6dmXU3q+V7KFWXL5Dx6J2VSMFABQByDunIoAbLbXpSMrSky8sKcb\n kxMK6pJG4oKICjjHPvrBq4Jw3fo3aKbjmS/ZFXUTMG9RI7E9r5phxfFKTxx41xHxJNHq4Zkqoa\n 3aRpmFZW2m7bZ3no6lA74fV9IrXhySfB3dP8goRpq2ddi0rZylm4OoeZmI+lALhIGfI1hyzkpS\n M+o1KyOkuB7dnezeZtWnTbNCmCCwI5MicpHWBtJ4Y3cjJNTpNK80qs83rdQscP6yY+jdJW/Q2m\n oFltrSUx4rQb3wgJU4QOKlY769TGOyKijyzbfLNxTkBQAUAedjpSdpra76vu/vXa3R8UVvsbGm\n ICgAoAKALifg6dmXU3q+V7KFWXL5Dx6J2VSMFABQAUAIbbDfGbdplNvUkKeuK+rTk8gkbxP5Vj\n 1jrA2dDQq8yILbSoN505dvnLY2qVBVkqjp+0g+Kf8AauJGpVZ3JQp8CBlba2wy43JdDTrQ+pqS\n ndKSPwrWlGHXZfiT9icibSZWorp8vbEiQpZH6xKfpFZZ7IXbJnKTfBLfo0a+a2Z6xs+nblhY1R\n loyVfaQ8lO8kfccAVq+JW55Y/yzkfIY/xU/wBEzVDBIPMcK7hwjigAoAKAPOx0pO01td9X3f3r\n tbo+KK32NjTEBQAUAFAFxPwdOzLqb1fK9lCrLl8h49E7KpGCgD7SjKc8kj+salRb6Ibo0EjUK5\n M8RIKCUpJDsgjgMdwrfDTxSuRW5voaTpLvPQrdpW8JJUiNci2+e4JW2sD88Vz9fh34qSOn8e/9\n rt+hoLiW7gzvkAjn415+Ea4Z6W00Iu96YtdxO9NtkWWr951lKjj8RWtRTSbRCbsxbTpu32peYc\n BiN4dU2E4/hXPy405cIuuuzCuinZW0/QTcVRDjFzQVEefCt/xMPr1G5+00YtVUsEv4Tvg6+cYk\n li5NpKRgB5vgccsmvRrTb43F8nkd1cCvYkNSWw404lxChkEVllCUXTGtPo+8UhIUAedjpSdpra\n 76vu/vXa3R8UVvsbGmICgAoAKALifg6dmXU3q+V7KFWXL5Dx6J3oQpZwkZNVJOTpDXRkiKGgCv\n BOM+VaoYkl+RXZrbg+pMOS+tQ3G0EjwHCtNJdCWaXRlvDts+ZeOC8SofjVk+xWJ/bBpVjUWgL1\n b5b7ERlSEuNyZKwhttxJBSSo8Bx4VRkh9kHEu0+R4simvRGGDa7hAilMlpRSkYU4n6kHzBHDBr\n hSwuLe5HrMWRT5i+zTTCp9wjI51TPhI1VRjTXFNMhtpOHVcvKss+0PtNtss0LIuu0mxy1tqcbh\n OGS4rGQCBw/OunoFeTd+jma6e3A1+yVD9iNxhlxA/WA7wHj5V38dpWjyzfNHxp26uWtgcwje3T\n 5U8lb5BC4iXZL7YU4OB/ro/2rHPFF8jpmalxDqSptQWn94VklBxYydnnY6Unaa2u+r7v712tkf\n FCPsbGmICgAoAKALifg6KSnozamyoJ/wCL5XM/3KFVE4uUuB06ROtdxTDBHLhnNaY41FFN2YDe\n pRJjyEEgKQQMnvB5U6hTJMDW8lTGm0xkZD0pSUcOeCasgrlZAntWbSlaHtbDbFlMlTSQhIddCA\n SPuqyGN5JUheiOe1G8Xva1OgyL5ILVrjqK27RHURHC+4r/AHyPOupgxQxP8uxW5PoLVAyC3vK4\n J3Nze+nHdgVZLDimpJrsmOScJJr0cXTT7MF9aSUhW6FAZxnNfPtfFaXO8cfF9HtNFqHqMak+12\n JK5ZirQtKeteJCEt54k1x3LdKjqs22qrRfbbaLZJtz8q3uMvJcefjKKcLJ4IJFe7+O00dPFKfs\n 8VrtT982l0uh4tm+3F521oj6jiL+YQQj5qMnIV5qTWzNgUJXj6Ocm32L9MmLcH5Co29uOJDu6p\n BThX41j5umMjkzHmzGbSsoGTnzoqx0b2NdDBkMtYyVgrX4AVRPHuiCdM8/fSfWHekttaWOStXX\n c/4x2ljwkKxs6YAoAKACgC3D4RroR0bdShS9xI1ZJUTn+5w6ux8ciSJrXa9tIkMtoO8lxvf41q\n 28CrgNPNsy31vPLDbSMOKKjjgKifQydnTc7j+kd4hLQCIwe+gHvA76RKkyTD1boNOp5O/ImKZZ\n Sc7qE5JohPYT6E8zsztcOHKYUtcjrU7oU4OKPAirnlk2miDFt2h4EOYwsp+tCcfV9lRHLNO8kp\n JpOrI/6Nntkt0mJOgXIYJaUphTbfJWcEV535bD/pjNvlcHd+KyVOUF12a3ZrpWTqOcq4zIgRFh\n kLKjx31dwFc343SfdlWSXSOh8jqfqhtT5YrLlpebJTcU/rCZS05aJ+nOcjFe6yZYygkvTPHQj+\n VmVbNnM5lCyhKMniElXOs+TKaUrHM09HkMW1pElOHm048cisT7IfB03J79rIHAISOXiTVmPsh9\n A1dutnSHVn9UhKWgfuGT+ZplFtcCt0ih3pIrS50iNqS08Uq1VdSPu+bdrI1TaGQ3VQAUAFABQB\n a78KF4I6Omo0kZSdVSc/8AiQ6ePYrJYy7glt0rC+KUlCQeI4HiP4YrrRVwKX2bG03L5uM6y2rI\n wAonw8Kpkv2OuxY2uKkOMKCUpbZRw4cc1nk+KHO+RKStZA447/Oqwo1T4KlOcuIqxAaxxgvA7v\n FaDnHjVidCvoRm0i2Nz9MTXVNHdZKVkHnkZ/3rPr8X2YJJmzQ5PrzqxQbP9FI01ou3trVuIUgy\n nludxVx4/cMVOjxLDhjETV5fuzSl66OlTqr3PTJaT1cVvIa/t55rP+lXSdOildGwCXGgDvZxVM\n uxkbRqUENdYFDGOIqpjCUXc+tmynFfZGSfw5VZh8mRNUJzUN0WzaYsVlRTImKUtR7wnNa/dIqf\n VlJm3dJTtw2hhRKlDUVxBJ7/ANpcrBPyYy6ENSEhQAUAFAFqfwq17nR61D4/pTI9pEqyPQrJMS\n FuFV2jb5S6F9c2c8eI4j8q62JpRi2VSTs79l89U16e2viW90ZJqMy2yoiPI5ztwk56lrcSORWD\n xxWNrguPpDalqCQrPjiquhjtTH3l+Q7/ABoXDFZiPwpEVwSY43lA8UHvFWKSIZ03O0p1eqLGEZ\n yOlxY69KxhG6OJrQtqi3LlFbtPjs0WqNSJ1bfBYrSv+aIh3ZTzfJ1SeG4k/ujHGoSqFsdc9m6j\n REsNpSEhOBwxWS7dssCWyNwkD+FKyUJt65lsutKyk4OM1EvGxkrYmVyCzZ1uFWXpDwbQknjx/w\n Dhq3EuLCfdGnQtVy1G6rO8hkpjtgHgAkcfzJrXDiLf7KpcUimzpBJ3NvW0lPhqW5D/ABTlcyfk\n yUIGlJCgAoAKALTPhZLCej1qHx/SiR7SJWjHG42QyS2o5JiXQOpOA+0W97wUORrZj5jQjMHZE+\n sytQ7yt15tSMnwzV+oe9QK4cNjqWXP9I85vk8d3vVWRltiijOobaK14C1cgO4VS0SdDtyQ0khB\n G9nhS0DMpNxCWd9eB+FTVgITV+qZz8aYzGdUwp1HUI6tO6EpP2j9/KuhjxpxiVX+TNhoWzRLFp\n 9EltsNoLY5jv76z53+e1jx5O5Fz+ZUtwrBSTyFU7UWHxJuyFHcB4+Rqtr0NXsRWp7ghLzLrTmS\n FbihnxqF00N1yImJfkXLU6WclLVvZW+sd2eQ/wBa1QVY7K27ZsNGbz85pzl1m+6rPmeFX1txpF\n btsp26Q/8Az/2mep7n7tyuVLtlg31KAUAFABQBaF8LxW70ftQHHH9J5HH/ALSJWrF4iskrrRzM\n Avjipo7x+7vrXiVWhX0GzncTGusptIDj620lY7wOI/zqcnFJirnociBHkyy1ugoCT9SlDmPKsm\n 6mWHbqK4i3oUhKypQ8OQp1yBq7S+/MdQCogE5JNM0ifRub9d1WuEhuOjrlK4YPdSx5INJCti3G\n etl4DqlfYKuOT5Vsb6oqrlijdjfLaecilZKAM4Pd91Y83LsshwJOKFR0kJP0g86hclsjh2ON1b\n gUN4JycHFS4iJiOv0JanStCt0rPI9xquC/Kiy+BES5sWzy7/DbC03BaWVqyk4UFkgBKu/G6o/j\n WyMbhX9Kn3YuNDNlCpCuG602lGabUcLgWD3OymrpCHO33aWfHU1z905XIfZYICoAKACgAoAtO+\n FjHW70d9RFJSB+lEgfUP7pErVi6FZIzUqCliS0s7wIIP3Vsx9iv9GFsiSJFkU2sklMkjPiAABR\n qOGV4/Y8kZ8IQd0EBIxWEuETqCap6eloZCc5PnWhKuRq4FVp2CjcbzxzSN+xbOi+uBV7ZZSnCG\n xk+dEOmTXFn3abe1NuK5CkBUnPBazwAqzJN44JixW5m3upBiP+BTjFVZOUEexGzd8QT1RCFkcD\n jIFTBFjEuxd3ZKy3I4q3uJQcCtTjwV3ydeocx1IO8paCnO6fGscPMs9DUaifMjVcdH2A4pBVj+\n wFY/8AatuLlOyqXY6+i0YtchZP1OLFVZnZMOymPpBcNve0r1NcvdOVzX2OxA1ABQB//9k=\nEND:VCARD",
          "type": "vCard"
        }
      ]
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>could not return any authentication sources</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/directory/DirectoryEntryServlet.java",
    "groupTitle": "Directory_Entries"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/auth/directory/search",
    "title": "Search profiles within a directory",
    "name": "getDirectoryEntries",
    "group": "Directory_Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "query",
            "optional": true,
            "field": "queryString",
            "description": "<p>the full-text query</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "body",
            "optional": false,
            "field": "UserProfile[]",
            "description": "<p>json-representation of the user profiles</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[{\n      \"username\":\"jdoe\",\n      \"firstName\":\"John\",\n      \"lastName\":\"Doe\",\n      \"phoneNumber\":\"+1-514-000-0000\",\n      \"phoneNumberExtension\":\"363\",\n      \"mobileNumber\":\"+1-514-000-0000\",\n      \"faxNumber\":\"+1-514-000-0000\",\n      \"profilePicture\":\"base64_encoded_picture\",\n      \"email\":\"jdoe@savoirfairelinux.com\",\n      \"organization\":\"SFL\"\n }]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>could not return any authentication sources</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/directory/SearchDirectoryServlet.java",
    "groupTitle": "Directory_Search"
  },
  {
    "version": "1.0.0",
    "type": "post",
    "url": "/api/login",
    "title": "Obtain an 0Auth token",
    "name": "postLogin",
    "group": "Login",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "header",
            "optional": true,
            "field": "authorization",
            "description": "<p>classical HTTP auth header</p>"
          },
          {
            "group": "Parameter",
            "type": "attribute",
            "optional": true,
            "field": "X509Certificate",
            "description": "<p>X509 User certificate</p>"
          },
          {
            "group": "Parameter",
            "type": "body",
            "optional": true,
            "field": "LoginRequest",
            "description": "<p>username/password sent to server as JSON object</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "body",
            "optional": false,
            "field": "AuthTokenResponse",
            "description": "<p>the 0Auth authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "403": [
          {
            "group": "403",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>The user is unauthorized</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/LoginServlet.java",
    "groupTitle": "Login"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/nameserver/addr/*",
    "title": "Lookup user from address",
    "name": "getAddr",
    "group": "NameServer",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "path",
            "optional": false,
            "field": "String",
            "description": "<p>username</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"name\": \"sidokhine6\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>Address does not exist</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>could not fetch user information</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/jaminameserver/AddressServlet.java",
    "groupTitle": "NameServer"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/nameserver/name/*",
    "title": "Look up a user on the nameserver",
    "name": "getName",
    "group": "NameServer",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "path",
            "optional": false,
            "field": "String",
            "description": "<p>username</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"publickey\": \"\",\n  \"signature\": \"\",\n  \"name\": \"sidokhine6\",\n  \"addr\": \"0d1f0002ce728d6aa8b98b5227c75fc773735f9e\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>user does not exist</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>could not fetch user information</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/jaminameserver/NameServlet.java",
    "groupTitle": "NameServer"
  },
  {
    "version": "1.0.0",
    "type": "get",
    "url": "/api/auth/user",
    "title": "Get JAMS user info",
    "name": "getUser",
    "group": "User",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "body",
            "optional": false,
            "field": "User",
            "description": "<p>json user object representation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"username\":\"jdoe\",\n     \"password\":null,\n     \"userType\":\"AD\",\n     \"realm\":\"savoirfairelinux\",\n     \"accessLevel\":\"USER\",\n     \"needsPasswordReset\":false,\n     \"ethAddress\":\"8272773ac\",\n     \"ethKey\":\"192938ae72772ab\",\n     \"jamiId\":\"6e3552723df\",\n     \"certificate\":\"pem_formatted_certificate\",\n     \"privateKey\":\"pem_formatted_key\",\n     \"revoked\":false\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>could not fetch user information</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/user/UserServlet.java",
    "groupTitle": "User"
  },
  {
    "version": "1.0.0",
    "type": "put",
    "url": "/api/auth/user",
    "title": "Modify the user's info (for now just the password)",
    "name": "putUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "query",
            "optional": false,
            "field": "password",
            "description": "<p>new password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>password successfully changed</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>could not changed password</p>"
          }
        ]
      }
    },
    "filename": "src/main/java/net/jami/jams/server/servlets/api/auth/user/UserServlet.java",
    "groupTitle": "User"
  }
] });
