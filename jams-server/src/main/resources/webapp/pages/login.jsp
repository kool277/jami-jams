<!-- /*
 *     JAMS - Jami Account Management Server
 *     Copyright (C) 2019 Savoir-faire Linux Inc.
 *
 *     Author: Mohammed Raza <mohammed.raza@savoirfairelinux.com>
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */ -->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<% Boolean installed = (Boolean) request.getAttribute("installed");%>
<!DOCTYPE html>
<html>
  <title>JAMS Client</title>
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <![endif]-->
  <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  <link rel="stylesheet" href="../css/bootstrap.css">
  <link rel="stylesheet" href="../css/font-awesome.min.css">
  <link rel="stylesheet" href="../css/aos.css">
  <link rel="stylesheet" href="../css/main.css">
  <script src="../js/lib/jquery.min.js" charset="utf-8"></script>
  <script>
    $(function () {
      $("#header").load("/pages/header.html");
      $("#footer").load("/pages/footer.html");
    });
  </script>
  <body>
    <div id="header" class="header"></div>
    <div class="spacer spacer--huge"></div>
    <div id="content">
      <div class="container" data-aos="fade-up">
        <div class="row">
          <div class="col-md-6 offset-md-3">
            <form id="form-signup" class="d-none form-container">
              <div class="form-label-group">
                <div class="notification" style="display:none"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>Cannot establish a connection with the API</div>
                <div class="title"></div>
                <div class="subtitle"></div>
              </div>
              <div class="form-label-group">
                <label for="inputUsername" class="label-title">Username</label>
                <input type="text" name="username" id="inputUsername" class="form-control" required autocomplete="off">
              </div>
              <div class="form-label-group">
                <label for="inputPassword" class="label-title">Password</label>
                <input type="password" name="password" id="inputPassword" class="form-control" required autocomplete="off">
                <div class="progress" id="admin-password-progress-bar-container" style="display:none" >
                  <div class="progress-bar" id="admin-password-progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div>
                </div>
              </div>
              <input class="btn btn-lg btn-primary btn-block form-submit" type="submit">
            </form>
          </div>
        </div>
      </div>
    </div>
    <div id="footer"></div>
    <script src="../js/lib/jquery.min.js" charset="utf-8"></script>
    <script src="../js/lib/popper.min.js" charset="utf-8"></script>
    <script src="../js/lib/bootstrap.min.js" charset="utf-8"></script>
    <script src="../js/lib/jquery.validate.min.js" charset="utf-8"></script>
    <script src="../js/lib/additional-methods.min.js" charset="utf-8"></script>
    <script src="../js/password.js" charset="utf-8"></script>
  </body>
</html>
