"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  Chip,
  Tab,
  Tabs,
  InputAdornment,
  useTheme,
} from "@mui/material"
import {
  Group as GroupIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Share as ShareIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material"
import Navbar from "../../components/ui/navbar"

export default function GroupsPage({ darkMode, toggleDarkMode }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const theme = useTheme()

  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState([])
  const [myGroups, setMyGroups] = useState([])
  const [joinedGroups, setJoinedGroups] = useState([])
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [openJoinDialog, setOpenJoinDialog] = useState(false)
  const [openShareDialog, setOpenShareDialog] = useState(false)
  const [openInviteDialog, setOpenInviteDialog] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [groupCode, setGroupCode] = useState("")
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [copied, setCopied] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Sample data for preview mode
  const sampleGroups = [
    {
      id: "group1",
      name: "Biology Study Group",
      description: "Collaborative study group for Biology 101",
      owner: {
        id: "user1",
        name: "You",
        email: "you@example.com",
        avatar: "Y",
      },
      members: [
        {
          id: "user2",
          name: "Alex Johnson",
          email: "alex@example.com",
          avatar: "A",
        },
        {
          id: "user3",
          name: "Sarah Miller",
          email: "sarah@example.com",
          avatar: "S",
        },
      ],
      decks: [
        {
          id: "deck1",
          name: "Cell Biology",
          cardCount: 42,
        },
        {
          id: "deck2",
          name: "Genetics",
          cardCount: 28,
        },
      ],
      createdAt: new Date().toISOString(),
      code: "BIO101",
    },
    {
      id: "group2",
      name: "Physics Study Group",
      description: "Advanced physics concepts and problem solving",
      owner: {
        id: "user4",
        name: "David Chen",
        email: "david@example.com",
        avatar: "D",
      },
      members: [
        {
          id: "preview-user",
          name: "You",
          email: "you@example.com",
          avatar: "Y",
        },
        {
          id: "user5",
          name: "Emily Rodriguez",
          email: "emily@example.com",
          avatar: "E",
        },
      ],
      decks: [
        {
          id: "deck3",
          name: "Mechanics",
          cardCount: 35,
        },
        {
          id: "deck4",
          name: "Electromagnetism",
          cardCount: 47,
        },
      ],
      createdAt: new Date().toISOString(),
      code: "PHYS202",
    },
  ]

  // Check if we're in preview mode
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsPreviewMode(true)
        setLoading(false)

        // Set sample groups
        setGroups(sampleGroups)

        // Split into my groups and joined groups
        setMyGroups([sampleGroups[0]])
        setJoinedGroups([sampleGroups[1]])
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isLoaded])

  // Fetch groups when user is loaded
  useEffect(() => {
    if (isLoaded && isSignedIn && !isPreviewMode) {
      fetchGroups()
    }
  }, [isLoaded, isSignedIn, isPreviewMode])

  const fetchGroups = async () => {
    try {
      setLoading(true)

      // In a real implementation, you would fetch this data from your database
      // For now, we'll use the sample data
      setGroups(sampleGroups)

      // Split into my groups and joined groups
      setMyGroups([sampleGroups[0]])
      setJoinedGroups([sampleGroups[1]])

      setLoading(false)
    } catch (error) {
      console.error("Error fetching groups:", error)
      setLoading(false)
    }
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert("Please enter a group name")
      return
    }

    try {
      // In a real implementation, you would create the group in your database
      const newGroup = {
        id: `group-${Date.now()}`,
        name: newGroupName,
        description: newGroupDescription,
        owner: {
          id: isPreviewMode ? "preview-user" : user.id,
          name: isPreviewMode ? "You" : `${user.firstName} ${user.lastName}`,
          email: isPreviewMode ? "you@example.com" : user.primaryEmailAddress?.emailAddress,
          avatar: isPreviewMode ? "Y" : user.firstName?.[0] || "U",
        },
        members: [],
        decks: [],
        createdAt: new Date().toISOString(),
        code: `${newGroupName.substring(0, 3).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`,
      }

      setGroups([...groups, newGroup])
      setMyGroups([...myGroups, newGroup])

      setNewGroupName("")
      setNewGroupDescription("")
      setOpenCreateDialog(false)
    } catch (error) {
      console.error("Error creating group:", error)
      alert("Failed to create group. Please try again.")
    }
  }

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      alert("Please enter a group code")
      return
    }

    try {
      // In a real implementation, you would join the group in your database
      const foundGroup = groups.find((g) => g.code === groupCode)

      if (!foundGroup) {
        alert("Invalid group code. Please try again.")
        return
      }

      if (myGroups.some((g) => g.id === foundGroup.id) || joinedGroups.some((g) => g.id === foundGroup.id)) {
        alert("You are already a member of this group.")
        return
      }

      // Add user to group members
      const updatedGroup = {
        ...foundGroup,
        members: [
          ...foundGroup.members,
          {
            id: isPreviewMode ? "preview-user" : user.id,
            name: isPreviewMode ? "You" : `${user.firstName} ${user.lastName}`,
            email: isPreviewMode ? "you@example.com" : user.primaryEmailAddress?.emailAddress,
            avatar: isPreviewMode ? "Y" : user.firstName?.[0] || "U",
          },
        ],
      }

      // Update groups
      setGroups(groups.map((g) => (g.id === foundGroup.id ? updatedGroup : g)))
      setJoinedGroups([...joinedGroups, updatedGroup])

      setGroupCode("")
      setOpenJoinDialog(false)
    } catch (error) {
      console.error("Error joining group:", error)
      alert("Failed to join group. Please try again.")
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !selectedGroup) {
      alert("Please enter a valid email address")
      return
    }

    try {
      // In a real implementation, you would send an invitation email
      alert(`Invitation sent to ${inviteEmail}`)

      setInviteEmail("")
      setOpenInviteDialog(false)
    } catch (error) {
      console.error("Error inviting member:", error)
      alert("Failed to send invitation. Please try again.")
    }
  }

  const handleDeleteGroup = async (groupId) => {
    if (!confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      return
    }

    try {
      // In a real implementation, you would delete the group from your database
      setGroups(groups.filter((g) => g.id !== groupId))
      setMyGroups(myGroups.filter((g) => g.id !== groupId))
      setJoinedGroups(joinedGroups.filter((g) => g.id !== groupId))
    } catch (error) {
      console.error("Error deleting group:", error)
      alert("Failed to delete group. Please try again.")
    }
  }

  const handleLeaveGroup = async (groupId) => {
    if (!confirm("Are you sure you want to leave this group?")) {
      return
    }

    try {
      // In a real implementation, you would remove the user from the group in your database
      const group = groups.find((g) => g.id === groupId)

      if (!group) {
        return
      }

      // Remove user from group members
      const updatedGroup = {
        ...group,
        members: group.members.filter((m) => m.id !== (isPreviewMode ? "preview-user" : user.id)),
      }

      // Update groups
      setGroups(groups.map((g) => (g.id === groupId ? updatedGroup : g)))
      setJoinedGroups(joinedGroups.filter((g) => g.id !== groupId))
    } catch (error) {
      console.error("Error leaving group:", error)
      alert("Failed to leave group. Please try again.")
    }
  }

  const handleCopyCode = () => {
    if (selectedGroup) {
      navigator.clipboard.writeText(selectedGroup.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const filteredMyGroups = myGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredJoinedGroups = joinedGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isLoaded || (!isSignedIn && !isPreviewMode)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}>
            <GroupIcon sx={{ mr: 2, color: "primary.main" }} />
            Study Groups
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
            Collaborate with others and share flashcard decks
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: { xs: "100%", sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={() => setOpenJoinDialog(true)}>
              Join Group
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateDialog(true)}>
              Create Group
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="group tabs">
                <Tab label="My Groups" />
                <Tab label="Joined Groups" />
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <Box>
                {filteredMyGroups.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid", borderColor: "divider" }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {searchTerm ? "No matching groups found" : "You haven't created any groups yet"}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                      {searchTerm
                        ? "Try a different search term or create a new group"
                        : "Create a group to collaborate with others and share flashcard decks"}
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateDialog(true)}>
                      Create Group
                    </Button>
                  </Paper>
                ) : (
                  <Grid container spacing={3}>
                    {filteredMyGroups.map((group) => (
                      <Grid item xs={12} md={6} key={group.id}>
                        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
                            >
                              <Box>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                  {group.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {group.description}
                                </Typography>
                              </Box>
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedGroup(group)
                                    setOpenShareDialog(true)
                                  }}
                                >
                                  <ShareIcon />
                                </IconButton>
                                <IconButton size="small" onClick={() => handleDeleteGroup(group.id)} color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Members ({group.members.length + 1})
                              </Typography>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                <Chip
                                  avatar={<Avatar>{group.owner.avatar}</Avatar>}
                                  label={`${group.owner.name} (Owner)`}
                                  color="primary"
                                  size="small"
                                />
                                {group.members.map((member) => (
                                  <Chip
                                    key={member.id}
                                    avatar={<Avatar>{member.avatar}</Avatar>}
                                    label={member.name}
                                    size="small"
                                  />
                                ))}
                                <Chip
                                  icon={<AddIcon />}
                                  label="Invite"
                                  variant="outlined"
                                  size="small"
                                  onClick={() => {
                                    setSelectedGroup(group)
                                    setOpenInviteDialog(true)
                                  }}
                                />
                              </Box>
                            </Box>

                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Shared Decks ({group.decks.length})
                              </Typography>
                              {group.decks.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                  No decks shared yet
                                </Typography>
                              ) : (
                                <List dense disablePadding>
                                  {group.decks.map((deck) => (
                                    <ListItem key={deck.id} disablePadding sx={{ py: 0.5 }}>
                                      <ListItemText primary={deck.name} secondary={`${deck.cardCount} cards`} />
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                            </Box>

                            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => router.push(`/groups/${group.id}`)}
                              >
                                View Group
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                {filteredJoinedGroups.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid", borderColor: "divider" }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {searchTerm ? "No matching groups found" : "You haven't joined any groups yet"}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                      {searchTerm
                        ? "Try a different search term or join a new group"
                        : "Join a group to collaborate with others and access shared flashcard decks"}
                    </Typography>
                    <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setOpenJoinDialog(true)}>
                      Join Group
                    </Button>
                  </Paper>
                ) : (
                  <Grid container spacing={3}>
                    {filteredJoinedGroups.map((group) => (
                      <Grid item xs={12} md={6} key={group.id}>
                        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
                            >
                              <Box>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                  {group.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {group.description}
                                </Typography>
                              </Box>
                              <Box>
                                <IconButton size="small" onClick={() => handleLeaveGroup(group.id)} color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Members ({group.members.length + 1})
                              </Typography>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                <Chip
                                  avatar={<Avatar>{group.owner.avatar}</Avatar>}
                                  label={`${group.owner.name} (Owner)`}
                                  color="primary"
                                  size="small"
                                />
                                {group.members.map((member) => (
                                  <Chip
                                    key={member.id}
                                    avatar={<Avatar>{member.avatar}</Avatar>}
                                    label={member.name}
                                    size="small"
                                  />
                                ))}
                              </Box>
                            </Box>

                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Shared Decks ({group.decks.length})
                              </Typography>
                              {group.decks.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                  No decks shared yet
                                </Typography>
                              ) : (
                                <List dense disablePadding>
                                  {group.decks.map((deck) => (
                                    <ListItem key={deck.id} disablePadding sx={{ py: 0.5 }}>
                                      <ListItemText primary={deck.name} secondary={`${deck.cardCount} cards`} />
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                            </Box>

                            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => router.push(`/groups/${group.id}`)}
                              >
                                View Group
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* Create Group Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Study Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            fullWidth
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newGroupDescription}
            onChange={(e) => setNewGroupDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateGroup} variant="contained">
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* Join Group Dialog */}
      <Dialog open={openJoinDialog} onClose={() => setOpenJoinDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join Study Group</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter the group code provided by the group owner to join.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Group Code"
            fullWidth
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoinDialog(false)}>Cancel</Button>
          <Button onClick={handleJoinGroup} variant="contained">
            Join Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Group Dialog */}
      <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Group</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Share this code with others to let them join your group.
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              mb: 3,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 2 }}>
              {selectedGroup?.code}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            fullWidth
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            onClick={handleCopyCode}
            color={copied ? "success" : "primary"}
          >
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenShareDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Member</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter the email address of the person you want to invite to {selectedGroup?.name}.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInviteDialog(false)}>Cancel</Button>
          <Button onClick={handleInviteMember} variant="contained">
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
