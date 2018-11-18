
<div id="incp-appnew-alert" class="alert alert-danger" style="display:none"></div>

<div id="incp-appnew-form">

<table class="incp-formtable">
<tbody>

<tr>
  <td width="180px">Name</td>
  <td>
    <input name="name" class="form-control" value="">
  </td>
</tr>

<tr>
  <td>Spec</td>
  <td>
    {[=it.spec.meta.id]}
  </td>
</tr>

<tr>
  <td>Minimum Requirements</td>
  <td>
    <table>
      <thead><tr>
        <th width="33%">CPU units (1000m = 1 core)</th>
        <th width="33%">Memory Size</th>
        <th>System Volume Size</th>
      </tr></thead>
      <tbody>
      <tr>
        <td>{[=it.spec.exp_res.cpu_min]} m</td>
        <td>{[=inCp.UtilResSizeFormat(it.spec.exp_res.mem_min)]}</td>
        <td>{[=inCp.UtilResSizeFormat(it.spec.exp_res.vol_min, 1)]}</td>
      </tr>
      </tbody>
    </table>
  </td>
</tr>

</tbody>
</table>


</div>
