
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
        <th width="33%">CPU</th>
        <th width="33%">Memory</th>
        <th>System Volume</th>
      </tr></thead>
      <tbody>
      <tr>
        <td>{[=it.spec.exp_res._cpu_min]} cores</td>
        <td>{[=it.spec.exp_res.mem_min]} MB</td>
        <td>{[=it.spec.exp_res.vol_min]} GB</td>
      </tr>
      </tbody>
    </table>
  </td>
</tr>

</tbody>
</table>


</div>
