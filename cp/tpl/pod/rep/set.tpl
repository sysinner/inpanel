<div id="incp-podrep-set-alert"></div>

<div id="incp-podrep-set">  

<input type="hidden" name="pod_id" value="{[=it._pod_id]}">
<input type="hidden" name="rep_id" value="{[=it._rep_id]}">

<table class="incp-formtable">

<tr>
  <td width="25%">Pod - Replica ID</td>
  <td>
    {[=it._pod_id]} - {[=it._rep_id]}
  </td>
</tr>

<tr>
  <td>
    Migrate Replica
  </td>
  <td>
    <div class="form-group form-check">
      <input type="checkbox" class="form-check-input" name="pod_rep_action_migrate" value="yes">
      <label class="form-check-label">
        Migrate Replica to a new host
      </label>
      <span class="form-text text-muted">
        The system will automatically stop the replica instance, migrate the data to the new host and launch it.
      </span>
    </div>
  </td>
</tr>

</table>

</div>
