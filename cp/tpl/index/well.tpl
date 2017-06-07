<style>
.ctn {
  width: 100%;
  height: 100%;
  position: relative;
  min-width: 800px;
  min-height: 500px;

  display: flex;
  justify-content: center;
  align-items: center;
}
.cbox {
  position: absolute;
  width: 400px;
  margin: 0 auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  /*
  border: 2px solid #999;
  border-radius: 3px;
  */
  /*
  background-color: rgb(195, 218, 237);
  background-color: rgba(255, 255, 255, 1);
  */
  /*
  border: 1px solid #0078e7;
  */

  /*
  box-shadow: 0px 1px 2px 1px #555;
  */
}
.cbox-body {
  height: 150px;
  padding: 20px;
  /*
  background-color: #0078e7;
  */
  text-align: center;
}
.cbox-status {
  padding: 20px;
  /*
  background-color: #0078e7;
  */
  border-radius: 2px;
  background-color: #e1f2fa;
  text-align: center;
  font-size: 24px;
}
</style>

<div class="ctn">

<div class="cbox">
  <div class="cbox-body">
     loading
  </div>
  <div class="cbox-status">
  loading
  </div>
</div>

</div>
