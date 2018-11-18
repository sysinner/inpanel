<div id="incp-podentry-access-alert"></div>
<div id="incp-podentry-access">  

<input type="hidden" name="meta_id" value="{[=it.meta.id]}">

<table class="incp-formtable">
<tbody>

<tr>
  <td width="180px">SSH Access</td>
  <td>
    <div class="form-check form-check-inline">
      <input type="radio" name="operate_access_ssh_on" value="1" onclick="inCpPod.EntryAccessSshRefresh()" {[ if (it.operate.access.ssh_on) { ]}checked="checked"{[ } ]} class="form-check-input">
      <label class="form-check-label">Enable &nbsp;</label>
    </div>
    <div class="form-check form-check-inline">
      <input type="radio" name="operate_access_ssh_on" value="0" onclick="inCpPod.EntryAccessSshRefresh()" {[ if (!it.operate.access.ssh_on) { ]}checked="checked"{[ } ]} class="form-check-input">
      <label class="form-check-label">Disable &nbsp;</label>
    </div>
  </td>
</tr>

<tr id="operate_access_ssh_enable">
  <td>SSH Public Key</td>
  <td>
    <textarea name="operate_access_ssh_key" rows="6" class="form-control">{[=it.operate.access.ssh_key]}</textarea>
    <div class="alert alert-secondary" style="margin:10px 0 0 0;">
      Getting your SSH Public Key: <strong>cat ~/.ssh/id_rsa.pub</strong>,<br/> or if the id_rsa.pub file does not exist, you may create a new one (Linux,Unix,MacOS): <strong>ssh-keygen -t rsa</strong>.
    </div>
  </td>
</tr>

<!--
<tr>
  <td>Password</td>
  <td>
    <input type="text" name="operate_access_ssh_pwd" value="{[=it.operate.access.ssh_pwd]}" class="form-control">
  </td>
</tr>
-->


</tbody>
</table>


</div>
