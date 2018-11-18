
<div id="incp-app-specset-executorset-p5-alert" class="alert alert-danger hide"></div>

<div id="incp-app-specset-executorset-p5">
<table class="incp-formtable">
<tbody>

<tr>
  <td width="180px">Name</td>
  <td>
    <input name="name" class="form-control form-control-sm" value="{[=it.name]}">
  </td>
</tr>

<tr>
  <td>ExecStart</td>
  <td>
    <textarea id="spec_exec_start" name="exec_start" class="form-control form-control-sm" rows="12">{[=it.exec_start]}</textarea>
  </td>
</tr>

<tr>
  <td>ExecStop</td>
  <td>
    <textarea id="spec_exec_stop" name="exec_stop" class="form-control" rows="3">{[=it.exec_stop]}</textarea>
  </td>
</tr>

<tr>
  <td>Priority (0 ~ 15)</td>
  <td>
    <input name="priority" class="form-control form-control-sm" value="{[=it.priority]}">
  </td>
</tr>

<tr>
  <td>Plan</td>
  <td>
    <select name="plan" class="form-control form-control-sm">
      <option value="on_boot" {[=it.plan.on_boot_selected]}>On Boot</option>
      <option value="on_tick" {[=it.plan.on_tick_selected]}>On Tick</option>
    </select>
  </td>
</tr>

</tbody>
</table>
</div>

