
<div id="incp-appnew-alert" class="alert alert-danger" style="display:none"></div>

<div id="incp-appnew-form">
  <div class="l4i-form-group">
    <label>Name</label>
    <p><input name="name" class="form-control" value=""></p>
  </div>

  <div class="l4i-form-group">
    <label>Spec</label>
    <div>{[=it.spec.meta.id]}</div>
  </div>

  <div class="l4i-form-group">
    <label>Resource Requirements</label>
    <div>
      <table width="100%">
      <tr>
        <td width="33%">CPU: {[=it.spec.exp_res.cpu_min]}m</td>
        <td width="33%">Memory: {[=inCp.UtilResSizeFormat(it.spec.exp_res.mem_min)]}</td>
        <td width="33%">System Volume: {[=inCp.UtilResSizeFormat(it.spec.exp_res.vol_min)]}</td>
      </tr>
      </table>
    </div>
  </div>


</div>
